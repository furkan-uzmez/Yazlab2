import mysql.connector

def like_comment(connection, comment_id: int, username: str) -> bool:
    """
    Bir yoruma beğeni ekler veya kaldırır (Toggle).
    Tablo: comment_likes
    """
    if connection is None: return False

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. Kullanıcı ID'sini bul
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user: return False
        user_id = user['user_id']

        # 2. Beğeni var mı kontrol et
        check_query = "SELECT 1 FROM comment_likes WHERE user_id = %s AND comment_id = %s"
        cursor.execute(check_query, (user_id, comment_id))
        exists = cursor.fetchone()

        if exists:
            # Varsa sil (Unlike)
            cursor.execute("DELETE FROM comment_likes WHERE user_id = %s AND comment_id = %s", (user_id, comment_id))
            print(f"Yorum {comment_id} beğenisi kaldırıldı.")
        else:
            # Yoksa ekle (Like)
            cursor.execute("INSERT INTO comment_likes (user_id, comment_id) VALUES (%s, %s)", (user_id, comment_id))
            print(f"Yorum {comment_id} beğenildi.")

        connection.commit()
        cursor.close()
        return True

    except Exception as e:
        print(f"Hata: {e}")
        if connection: connection.rollback()
        return False