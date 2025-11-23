import mysql.connector

def get_following(connection, email: str) -> list:
    """
    Belirtilen bir kullanıcının takip ettiği kullanıcıların listesini
    (username, avatar_url) döndürür.

    :param connection: Veritabanı bağlantı nesnesi
    :param email: Takip edilenleri listelenecek kullanıcının email'i 
    :return: Başarılıysa bir sözlük listesi, hata olursa None
    """
    
    if connection is None:
        print("HATA: get_following - Veritabanı bağlantısı 'None' olarak geldi.")
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Bu sorgu, kullanıcının takip ettiği kişileri (followed_id) bulur
        query = """
            SELECT 
                u.user_id,
                u.username,
                u.avatar_url
            FROM 
                users u
            JOIN 
                follows f ON u.user_id = f.followed_id
            JOIN 
                users target_user ON f.follower_id = target_user.user_id
            WHERE 
                target_user.email = %s;
        """
        
        cursor.execute(query, (email,))
        
        following_list = cursor.fetchall()

        cursor.close()
        
        return following_list

    except mysql.connector.Error as e:
        print(f"HATA: get_following SQL hatası: {e}")
        return None 
    except Exception as e:
        print(f"HATA: get_following fonksiyonunda beklenmedik hata: {e}")
        return None

