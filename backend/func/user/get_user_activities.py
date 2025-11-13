import mysql.connector

def get_user_activities(connection, username: str):
    """
    Belirtilen kullanıcının son aktivitelerini (Puanlar, Yorumlar)
    ilgili içerik (Film/Kitap) detaylarıyla birlikte getirir.
    """
    if connection is None:
        return None

    try:
        cursor = connection.cursor(dictionary=True)

        # Bu sorgu biraz karmaşıktır çünkü 'reference_id' duruma göre
        # farklı tablolara (ratings veya reviews) bağlanır.
        query = """
        SELECT 
            a.activity_id,
            a.type,
            a.created_at,
            
            -- İçerik Bilgileri (Hem rating hem review için ortaktır)
            c.title AS content_title,
            c.poster_url AS content_poster,
            c.type AS content_type,
            c.content_id,

            -- Eğer aktivite 'rating' ise puanı buraya gelir, değilse NULL olur
            r.score AS rating_score,

            -- Eğer aktivite 'review' ise yorum metni buraya gelir, değilse NULL olur
            rev.text AS review_text

        FROM activities a
        JOIN users u ON a.user_id = u.user_id
        
        -- 1. Ratings Tablosuna Bağlan (Sadece type='rating' ise eşleşir)
        LEFT JOIN ratings r ON a.reference_id = r.rating_id AND a.type = 'rating'
        
        -- 2. Reviews Tablosuna Bağlan (Sadece type='review' ise eşleşir)
        LEFT JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
        
        -- 3. Contents Tablosuna Bağlan
        -- İçerik ID'si ya rating tablosundan ya da review tablosundan gelir.
        -- COALESCE fonksiyonu, null olmayan ilk değeri alır.
        LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id)

        WHERE u.username = %s
        ORDER BY a.created_at DESC
        LIMIT 15;
        """

        cursor.execute(query, (username,))
        activities = cursor.fetchall()
        
        cursor.close()
        return activities

    except mysql.connector.Error as e:
        print(f"HATA: get_user_activities SQL hatası: {e}")
        return []
    except Exception as e:
        print(f"HATA: get_user_activities beklenmedik hata: {e}")
        return []