def get_comments(connection):    
    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT 
            r.review_id,
            r.text,
            r.created_at,
            r.content_id,        
            u.username,
            u.avatar_url
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        ORDER BY r.created_at
    """
    cursor.execute(query)
    comments_data = cursor.fetchall()
    cursor.close()

    if comments_data is not None and len(comments_data) > 0:
        return comments_data
    else:
        return False