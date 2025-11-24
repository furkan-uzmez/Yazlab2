import mysql.connector

def update_comment(connection, comment_id: int, username: str, new_text: str) -> bool:
    """
    Bir yorumun metnini günceller.
    Güvenlik: Sadece yorumun sahibi güncelleyebilir.
    """
    if connection is None:
        return False

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. ADIM: Kullanıcı ID'sini bul
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            print(f"HATA: Kullanıcı bulunamadı ({username}).")
            return False
        
        user_id = user['user_id']

        # 2. ADIM: Yorumun sahibini kontrol et
        # Yorum gerçekten bu kullanıcıya mı ait?
        check_query = "SELECT user_id FROM activity_comments WHERE comment_id = %s"
        cursor.execute(check_query, (comment_id,))
        comment = cursor.fetchone()

        if not comment:
            print("HATA: Yorum bulunamadı.")
            return False
        
        if comment['user_id'] != user_id:
            print(f"HATA: Yetkisiz işlem. Kullanıcı {user_id}, başkasının ({comment['user_id']}) yorumunu düzenlemeye çalıştı.")
            return False

        # 3. ADIM: Güncelleme işlemini yap
        update_query = "UPDATE activity_comments SET text = %s WHERE comment_id = %s"
        cursor.execute(update_query, (new_text, comment_id))
        
        connection.commit()
        cursor.close()
        
        if cursor.rowcount > 0:
            print(f"Yorum {comment_id} başarıyla güncellendi.")
            return True
        else:
            # Metin aynıysa rowcount 0 dönebilir, bu bir hata değildir ama işlem yapılmamıştır.
            print("Yorum güncellenemedi (belki metin aynıdır).")
            return True

    except Exception as e:
        print(f"HATA: Yorum güncellenirken hata oluştu: {e}")
        if connection:
            connection.rollback()
        return False