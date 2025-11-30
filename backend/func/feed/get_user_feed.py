import mysql.connector

def get_user_feed(connection, email: str, page: int = 1) -> list:
    if connection is None:
        return []

    ITEMS_PER_PAGE = 10
    offset = (page - 1) * ITEMS_PER_PAGE

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. Önce e-postadan giriş yapan kullanıcının ID'sini bulalım
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_row = cursor.fetchone()
        
        if not user_row:
            print("Kullanıcı bulunamadı.")
            return []
            
        current_user_id = user_row['user_id']

        # 2. Ana sorguya 'is_liked_by_me' kontrolünü ekleyelim
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
                (SELECT COUNT(*) FROM activity_comments ac WHERE ac.activity_id = a.activity_id AND ac.just_content = 0) AS comment_count,

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

            WHERE a.user_id IN (
                -- Takip edilen kullanıcılar
                SELECT f.followed_id 
                FROM follows f
                JOIN users curr_u ON f.follower_id = curr_u.user_id
                WHERE curr_u.email = %s
            )

            
            ORDER BY a.created_at DESC
            LIMIT %s OFFSET %s;
        """
        
        # Parametre sırasına dikkat: current_user_id, email, limit, offset
        cursor.execute(query, (current_user_id, email, ITEMS_PER_PAGE, offset))
        feed_items = cursor.fetchall()
        cursor.close()
        
        return feed_items

    except Exception as e:
        print(f"HATA: {e}")
        return []