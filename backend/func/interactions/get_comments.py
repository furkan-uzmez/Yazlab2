def get_comments(connection):
    if connection is None:
        return False

    try:
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                ac.comment_id,
                ac.text,
                ac.created_at,
                ac.activity_id, -- Bu yorumun hangi aktiviteye ait olduğu
                u.username,
                u.avatar_url
            FROM activity_comments ac
            JOIN users u ON ac.user_id = u.user_id
            ORDER BY ac.created_at DESC -- Genellikle en yeniler önce istenir
        """
        
        cursor.execute(query)
        comments_data = cursor.fetchall()
        cursor.close()

        # Veri varsa listeyi döndür, yoksa boş liste döndür
        # (Frontend'de .map() kullanırken hata almamak için [] dönmek False dönmekten daha güvenlidir)
        if comments_data:
            return comments_data
        else:
            return [] 

    except Exception as e:
        print(f"Hata: Yorumlar çekilemedi - {e}")
        return False