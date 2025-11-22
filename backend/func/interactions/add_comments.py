import mysql.connector

def add_comment(connection, user_email: str, activity_id: int, comment_text: str) -> bool:
    """
    Bir aktiviteye (Activity Card) yorum ekler.
    Tablo: activity_comments
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

        # 2. ADIM: Yorumu 'activity_comments' tablosuna ekle
        insert_comment_query = """
            INSERT INTO activity_comments (activity_id, user_id, text) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_comment_query, (activity_id, user_id, comment_text))
        
        # Değişiklikleri onayla
        connection.commit()
        cursor.close()
        
        print(f"Yorum başarıyla {activity_id} nolu aktiviteye eklendi.")
        return True

    except mysql.connector.Error as e:
        print(f"HATA: Yorum eklenirken SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False