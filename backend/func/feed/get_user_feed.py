import mysql.connector

def get_user_feed(connection, email: str, page: int = 1) -> list:
    """
    Kullanıcının e-postasına göre ana sayfa akışını (feed) alır.
    Akış, kullanıcının takip ettiği kişilerin en son aktivitelerinden oluşur. 

    Args:
        connection: Veritabanı bağlantı nesnesi.
        email (str): Akışı alınacak olan (giriş yapmış) kullanıcının e-postası.
        page (int): Sayfalandırma için sayfa numarası. 
    Returns:
        list: Kullanıcının akışı için bir aktivite sözlüğü listesi.
    """
    
    if connection is None:
        print("HATA: get_user_feed - Veritabanı bağlantısı 'None' geldi.")
        return []

    # Sayfalandırma ayarları (Dokümana göre 10-15 arası) [cite: 55]
    ITEMS_PER_PAGE = 10
    offset = (page - 1) * ITEMS_PER_PAGE

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Bu sorgu, önce 'email' ile giriş yapan kullanıcının ID'sini bulur,
        # sonra 'follows' tablosundan o kullanıcının takip ettiği ID'leri bulur,
        # 'activities' tablosundan o ID'lerin aktivitelerini çeker,
        # ve son olarak bu aktivitelerin detaylarını (kullanıcı, içerik, puan/yorum) birleştirir.
        query = """
            SELECT 
                a.activity_id,
                a.type,
                a.created_at,
                
                -- Aktiviteyi yapan kullanıcının bilgileri [cite: 33-34]
                u.username AS activity_user_username,
                u.avatar_url AS activity_user_avatar,
                
                -- Aktiviteye konu olan içeriğin bilgileri [cite: 38]
                c.title AS content_title,
                c.poster_url AS content_poster,
                c.type AS content_type,
                c.content_id,

                -- Aktivite detayları (Puan veya Yorum) [cite: 44-50]
                r.score AS rating_score,
                rev.text AS review_text

            FROM activities a
            
            -- Aktiviteyi yapan kullanıcıyı (U) join et
            JOIN users u ON a.user_id = u.user_id
            
            -- Aktivite detaylarını (rating, review) join et
            LEFT JOIN ratings r ON a.reference_id = r.rating_id AND a.type = 'rating'
            LEFT JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
            
            -- İçerik detaylarını (contents) join et
            -- COALESCE: Puanlama veya Yorum'dan hangisi doluysa onun content_id'sini alır
            LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id)

            WHERE a.user_id IN (
                -- Bu alt sorgu, giriş yapan kullanıcının (email) 
                -- takip ettiği kişilerin (followed_id) ID listesini döndürür
                SELECT f.followed_id 
                FROM follows f
                JOIN users current_user ON f.follower_id = current_user.user_id
                WHERE current_user.email = %s
            )
            
            ORDER BY a.created_at DESC -- En yeniden en eskiye sırala 
            LIMIT %s OFFSET %s; -- Sayfalandırma uygula [cite: 54]
        """
        
        cursor.execute(query, (email, ITEMS_PER_PAGE, offset))
        
        feed_items = cursor.fetchall()
        
        cursor.close()
        
        return feed_items

    except mysql.connector.Error as e:
        print(f"HATA: get_user_feed SQL hatası: {e}")
        return [] 
    except Exception as e:
        print(f"HATA: get_user_feed fonksiyonunda beklenmedik hata: {e}")
        return []