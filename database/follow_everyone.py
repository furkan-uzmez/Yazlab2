from backend.func.db.connection.open_db_connection import open_db_connection
import mysql.connector

def follow_everyone(email: str):
    connection = open_db_connection()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        
        # 1. Bu e-postaya sahip kullanıcının ID'sini bul
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"HATA: {email} kullanıcısı bulunamadı.")
            return

        current_user_id = user[0]
        print(f"İşlem yapılacak Kullanıcı ID: {current_user_id}")

        # 2. Bu kullanıcı HARİCİNDEKİ tüm kullanıcıların ID'lerini bul (Mock kullanıcılar)
        cursor.execute("SELECT user_id FROM users WHERE user_id != %s", (current_user_id,))
        other_users = cursor.fetchall()

        # 3. Herkesi takip etmesini sağla
        follow_query = "INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (%s, %s)"
        
        count = 0
        for other_user in other_users:
            target_id = other_user[0]
            cursor.execute(follow_query, (current_user_id, target_id))
            count += 1
            
        connection.commit()
        print(f"Başarılı: {email} artık {count} kişiyi takip ediyor.")
        print("Feed API'sini tekrar test edebilirsiniz.")

    except Exception as e:
        print(f"Bir hata oluştu: {e}")
        connection.rollback()
    finally:
        connection.close()

# KULLANIM:
if __name__ == "__main__":
    # Sorun yaşadığınız e-postayı buraya yazın
    follow_everyone("deneme@email.com")