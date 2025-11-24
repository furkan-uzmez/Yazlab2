import mysql.connector

def delete_comment(connection, comment_id: int, user_email: str) -> bool:
    """
    Bir yorumu siler. Sadece yorum sahibi silebilir.
    """
    if connection is None:
        return False

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. ADIM: E-posta adresinden user_id'yi bul
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (user_email,))
        user = cursor.fetchone()

        if not user:
            print(f"HATA: {user_email} kullanıcısı bulunamadı.")
            return False
        
        user_id = user['user_id']

        # 2. ADIM: Yorumun sahibi kontrolü
        check_query = """
            SELECT user_id FROM activity_comments 
            WHERE comment_id = %s
        """
        cursor.execute(check_query, (comment_id,))
        comment = cursor.fetchone()

        if not comment:
            print(f"HATA: {comment_id} nolu yorum bulunamadı.")
            cursor.close()
            return False

        if comment['user_id'] != user_id:
            print(f"HATA: Bu yorumu sadece sahibi silebilir.")
            cursor.close()
            return False

        # 3. ADIM: Yorumu sil (CASCADE ile comment_likes da silinecek)
        delete_query = """
            DELETE FROM activity_comments 
            WHERE comment_id = %s AND user_id = %s
        """
        cursor.execute(delete_query, (comment_id, user_id))
        
        # Değişiklikleri onayla
        connection.commit()
        cursor.close()
        
        print(f"Yorum {comment_id} başarıyla silindi.")
        return True

    except mysql.connector.Error as e:
        print(f"HATA: Yorum silinirken SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False

