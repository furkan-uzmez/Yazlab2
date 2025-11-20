from backend.func.db.connection.open_db_connection import open_db_connection
import mysql.connector

def make_them_follow_me(my_email: str):
    """
    Diğer tüm kullanıcıların, belirtilen e-postayı takip etmesini sağlar.
    Böylece 'Takipçilerim' (Followers) listesi dolar.
    """
    connection = open_db_connection()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        
        # 1. Sizin (hedef kullanıcının) ID'sini bul
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (my_email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"HATA: {my_email} kullanıcısı bulunamadı.")
            return

        my_user_id = user[0]
        print(f"Sizin Kullanıcı ID'niz: {my_user_id}")

        # 2. Sizi takip edecek diğer kullanıcıları (Mock users) bul
        cursor.execute("SELECT user_id, username FROM users WHERE user_id != %s", (my_user_id,))
        potential_followers = cursor.fetchall()

        # 3. Onların sizi takip etmesini sağla (INSERT)
        # follower_id = Onlar, followed_id = Siz
        follow_query = "INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (%s, %s)"
        
        count = 0
        for follower in potential_followers:
            follower_id = follower[0]
            follower_name = follower[1]
            
            try:
                cursor.execute(follow_query, (follower_id, my_user_id))
                if cursor.rowcount > 0:
                    print(f" -> {follower_name} artık sizi takip ediyor.")
                    count += 1
            except mysql.connector.Error as err:
                print(f"Hata: {err}")
            
        connection.commit()
        print(f"\nBaşarılı! Toplam {count} yeni takipçi kazandınız.")

    except Exception as e:
        print(f"Bir hata oluştu: {e}")
        connection.rollback()
    finally:
        connection.close()

if __name__ == "__main__":
    # Buraya kendi emailinizi yazın
    make_them_follow_me("lixeyo9216@chaineor.com")