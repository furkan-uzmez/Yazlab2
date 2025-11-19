import mysql.connector

def get_user_feed(connection, email: str, page: int = 1) -> list:
    if connection is None:
        print("HATA: get_user_feed - Veritabanı bağlantısı 'None' geldi.")
        return []

    ITEMS_PER_PAGE = 10
    offset = (page - 1) * ITEMS_PER_PAGE

    try:
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                a.activity_id,
                a.type,
                a.created_at,
                
                u.username AS activity_user_username,
                u.avatar_url AS activity_user_avatar,
                
                c.title AS content_title,
                c.cover_url AS content_poster, 
                c.type AS content_type,
                c.content_id,

                r.score AS rating_score,
                rev.text AS review_text

            FROM activities a
            
            JOIN users u ON a.user_id = u.user_id
            
            LEFT JOIN ratings r ON a.reference_id = r.rating_id AND a.type = 'rating'
            LEFT JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
            
            LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id)

            WHERE a.user_id IN (
                SELECT f.followed_id 
                FROM follows f
                JOIN users curr_u ON f.follower_id = curr_u.user_id
                WHERE curr_u.email = %s
            )
            
            ORDER BY a.created_at DESC
            LIMIT %s OFFSET %s;
        """
        
        cursor.execute(query, (email, ITEMS_PER_PAGE, offset))
        
        feed_items = cursor.fetchall()

        print(f"get_user_feed: {email} için {len(feed_items)} öğe getirildi (Sayfa {page}).")
        
        cursor.close()
        
        return feed_items

    except mysql.connector.Error as e:
        print(f"HATA: get_user_feed SQL hatası: {e}")
        return [] 
    except Exception as e:
        print(f"HATA: get_user_feed fonksiyonunda beklenmedik hata: {e}")
        return []