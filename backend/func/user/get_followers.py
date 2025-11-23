import mysql.connector

def get_followers(connection, email: str) -> list:
    """
    Belirtilen bir kullanıcının takipçilerinin listesini
    (user_id, email, avatar_url, bio) döndürür.

    :param connection: Veritabanı bağlantı nesnesi
    :param email: Takipçileri listelenecek email 
    :return: Başarılıysa bir sözlük listesi, hata olursa boş liste
    """
    
    if connection is None:
        print("HATA: get_followers - Veritabanı bağlantısı 'None' olarak geldi.")
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Bu sorgu, kullanıcı adını ('username') kullanarak 'users' tablosunu
        # iki kez birleştirir (JOIN):
        # 1. 'target_user' -> Takip edilen kişiyi (username) bulmak için.
        # 2. 'u' -> Takip eden kişilerin (follower_id) detaylarını almak için.
        query = """
            SELECT 
                u.user_id,
                u.username,
                u.avatar_url
            FROM 
                users u
            JOIN 
                follows f ON u.user_id = f.follower_id
            JOIN 
                users target_user ON f.followed_id = target_user.user_id
            WHERE 
                target_user.email = %s;
        """
        
        cursor.execute(query, (email,))
        
        followers_list = cursor.fetchall()

        
        cursor.close()
        
        return followers_list

    except mysql.connector.Error as e:
        print(f"HATA: get_followers SQL hatası: {e}")
        return None 
    except Exception as e:
        print(f"HATA: get_followers fonksiyonunda beklenmedik hata: {e}")
        return None