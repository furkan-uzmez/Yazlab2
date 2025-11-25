import mysql.connector

def get_user_activities(connection, target_user_id: int, viewer_id: int = None, page: int = 1) -> list:
    if connection is None:
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
                COALESCE(r.score, r2.score) AS rating_score,
                rev.text AS review_text,

                -- Toplam beğeni ve yorum sayısı
                (SELECT COUNT(*) FROM activities_likes al WHERE al.activity_id = a.activity_id) AS like_count,
                (SELECT COUNT(*) FROM activity_comments ac WHERE ac.activity_id = a.activity_id) AS comment_count,

                -- --- YENİ KISIM: BEN BEĞENDİM Mİ? ---
                -- Eğer sonuç 1 ise beğenmişimdir, 0 ise beğenmemişimdir.
                (SELECT COUNT(*) FROM activities_likes al2 
                 WHERE al2.activity_id = a.activity_id AND al2.user_id = %s) AS is_liked_by_me

            FROM activities a
            JOIN users u ON a.user_id = u.user_id
            LEFT JOIN ratings r ON (a.reference_id = r.rating_id AND a.type = 'rating')
            LEFT JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
            LEFT JOIN ratings r2 ON (a.type = 'review' AND r2.user_id = a.user_id AND r2.content_id = rev.content_id)
            LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id, r2.content_id)

            WHERE a.user_id = %s
            
            ORDER BY a.created_at DESC
            LIMIT %s OFFSET %s;
        """
        
        # Parametre sırasına dikkat: viewer_id (beğeni kontrolü için), target_user_id (kimin aktiviteleri), limit, offset
        cursor.execute(query, (viewer_id, target_user_id, ITEMS_PER_PAGE, offset))
        activities = cursor.fetchall()
        cursor.close()
        
        return activities

    except Exception as e:
        print(f"HATA: {e}")
        return []
