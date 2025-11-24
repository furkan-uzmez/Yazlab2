import mysql.connector

def get_user(connection, username: str) -> dict | None:
    """
    Verilen kullanıcı adına göre profil bilgilerini (ve takipçi sayılarını) getirir.
    
    Args:
        connection: Veritabanı bağlantı nesnesi.
        username: Aranan kullanıcının adı.
        
    Returns:
        dict: Kullanıcı verisi (password_hash hariç) veya None.
    """
    if connection is None:
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Bu sorgu:
        # 1. Users tablosundan temel bilgileri alır (Şifreyi almaz!)
        # 2. Follows tablosundan bu kişiyi takip edenleri sayar (followers_count)
        # 3. Follows tablosundan bu kişinin takip ettiklerini sayar (following_count)
        query = """
            SELECT 
                u.user_id,
                u.username,
                u.email,
                u.avatar_url,
                u.bio,
                u.created_at,
                
                (SELECT COUNT(*) FROM follows f1 WHERE f1.followed_id = u.user_id) AS followers_count,
                (SELECT COUNT(*) FROM follows f2 WHERE f2.follower_id = u.user_id) AS following_count

            FROM users u
            WHERE u.username = %s
        """
        
        cursor.execute(query, (username,))
        user_profile = cursor.fetchone()
        
        cursor.close()
        
        return user_profile

    except mysql.connector.Error as e:
        print(f"HATA: get_user_profile SQL hatası: {e}")
        return None
    except Exception as e:
        print(f"HATA: get_user_profile beklenmedik hata: {e}")
        return None