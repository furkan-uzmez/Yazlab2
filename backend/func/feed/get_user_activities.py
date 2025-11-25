import mysql.connector

def get_user_activities(connection, target_user_id: int, viewer_id: int = None, page: int = 1) -> list:
    if connection is None:
        return []

    ITEMS_PER_PAGE = 10
    offset = (page - 1) * ITEMS_PER_PAGE

    try:
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT * FROM (
                -- 1. Normal Aktiviteler (Rating, Review)
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
                    NULL AS comment_text,
                    NULL AS original_post_owner_username,

                    -- Toplam beğeni ve yorum sayısı
                    (SELECT COUNT(*) FROM activities_likes al WHERE al.activity_id = a.activity_id) AS like_count,
                    (SELECT COUNT(*) FROM activity_comments ac WHERE ac.activity_id = a.activity_id) AS comment_count,

                    -- Ben beğendim mi?
                    (SELECT COUNT(*) FROM activities_likes al2 
                     WHERE al2.activity_id = a.activity_id AND al2.user_id = %s) AS is_liked_by_me

                FROM activities a
                JOIN users u ON a.user_id = u.user_id
                LEFT JOIN ratings r ON (a.reference_id = r.rating_id AND a.type = 'rating')
                LEFT JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
                LEFT JOIN ratings r2 ON (a.type = 'review' AND r2.user_id = a.user_id AND r2.content_id = rev.content_id)
                LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id, r2.content_id)

                WHERE a.user_id = %s

                UNION ALL

                -- 2. Yorum Aktiviteleri (Başkasının gönderisine yapılan yorumlar)
                SELECT 
                    ac.comment_id AS activity_id, -- Unique ID için comment_id kullanıyoruz
                    'comment' AS type,
                    ac.created_at,
                    u.username AS activity_user_username,
                    u.avatar_url AS activity_user_avatar,
                    c.title AS content_title,
                    c.cover_url AS content_poster,
                    c.type AS content_type,
                    c.content_id,
                    NULL AS rating_score,
                    NULL AS review_text,
                    ac.text AS comment_text,
                    orig_u.username AS original_post_owner_username,

                    0 AS like_count, -- Yorumun beğenisi yok (şimdilik)
                    0 AS comment_count, -- Yorumun yorumu yok

                    0 AS is_liked_by_me

                FROM activity_comments ac
                JOIN users u ON ac.user_id = u.user_id
                JOIN activities orig_a ON ac.activity_id = orig_a.activity_id
                JOIN users orig_u ON orig_a.user_id = orig_u.user_id
                -- İçerik bilgisini orijinal aktiviteden bul
                LEFT JOIN ratings r ON (orig_a.reference_id = r.rating_id AND orig_a.type = 'rating')
                LEFT JOIN reviews rev ON (orig_a.reference_id = rev.review_id AND orig_a.type = 'review')
                LEFT JOIN ratings r2 ON (orig_a.type = 'review' AND r2.user_id = orig_a.user_id AND r2.content_id = rev.content_id)
                LEFT JOIN contents c ON c.content_id = COALESCE(r.content_id, rev.content_id, r2.content_id)

                WHERE ac.user_id = %s
            ) AS combined_activities
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s;
        """
        
        # Parametre sırasına dikkat: 
        # 1. Sorgu: viewer_id, target_user_id
        # 2. Sorgu: target_user_id
        # Limit/Offset: limit, offset
        cursor.execute(query, (viewer_id, target_user_id, target_user_id, ITEMS_PER_PAGE, offset))
        activities = cursor.fetchall()
        cursor.close()
        
        return activities

    except Exception as e:
        print(f"HATA: {e}")
        return []
