def follow(connection, follower_id, followee_id) -> bool:
    """
    Make follower_id follow followee_id.

    :param connection: Database connection object
    :param follower_id: ID of the user who wants to follow
    :param followed_id: ID of the user to be followed
    :return: True on success, False on failure
    """
    
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO follows (follower_id, followed_id) VALUES (%s, %s)"
            cursor.execute(sql, (follower_id, followee_id))
        
        connection.commit()
        return True # İşlem başarılı
        
    except Exception as e:
        # Hata oluştu (örn: PRIMARY KEY ihlali - zaten takip ediyor)
        print(f"HATA: Takip etme işlemi başarısız: {e}")
        connection.rollback() # Değişiklikleri geri al
        return False # İşlem başarısız


def unfollow(connection, follower_id, followed_id) -> bool:
    """
    Make follower_id unfollow followee_id.

    :param connection: Database connection object
    :param follower_id: ID of the user who wants to unfollow
    :param followed_id: ID of the user to be unfollowed
    :return: True on success, False on failure
    """
    
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM follows WHERE follower_id = %s AND followed_id = %s"
            cursor.execute(sql, (follower_id, followed_id))
        
        connection.commit()
        return True # İşlem başarılı
        
    except Exception as e:
        # Hata oluştu
        print(f"HATA: Takipten çıkma işlemi başarısız: {e}")
        connection.rollback() # Değişiklikleri geri al
        return False # İşlem başarısız

def check_follow_status(connection, follower_id, followed_id) -> bool:
    """
    Check if follower_id is following followed_id.

    :param connection: Database connection object
    :param follower_id: ID of the user who might be following
    :param followed_id: ID of the user who might be followed
    :return: True if following, False otherwise
    """
    try:
        with connection.cursor() as cursor:
            sql = "SELECT 1 FROM follows WHERE follower_id = %s AND followed_id = %s"
            cursor.execute(sql, (follower_id, followed_id))
            result = cursor.fetchone()
            return result is not None
    except Exception as e:
        print(f"HATA: Takip durumu kontrolü başarısız: {e}")
        return False