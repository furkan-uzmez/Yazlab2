import mysql.connector

def get_comments(connection, email: str): # email parametresi eklendi
    if connection is None:
        return []

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. Mevcut kullanıcının ID'sini bul (Eğer email verildiyse)
        current_user_id = None
        if email:
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
            user_row = cursor.fetchone()
            if user_row:
                current_user_id = user_row['user_id']

        # 2. Yorumları ve beğeni durumlarını çek
        query = """
            SELECT 
                ac.comment_id,
                ac.text,
                ac.created_at,
                ac.activity_id,
                u.username,
                u.avatar_url,
                
                -- Beğeni Sayısı
                (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = ac.comment_id) AS like_count,
                
                -- --- YENİ KISIM: Ben Beğendim mi? ---
                -- Eğer current_user_id varsa kontrol et, yoksa 0 döndür
                (SELECT COUNT(*) FROM comment_likes cl2 
                 WHERE cl2.comment_id = ac.comment_id AND cl2.user_id = %s) AS is_liked_by_me

            FROM activity_comments ac
            JOIN users u ON ac.user_id = u.user_id
            ORDER BY ac.created_at DESC
        """
        
        cursor.execute(query, (current_user_id,))
        comments_data = cursor.fetchall()
        cursor.close()

        if comments_data:
            return comments_data
        else:
            return [] 

    except Exception as e:
        print(f"Hata: Yorumlar çekilemedi - {e}")
        return []