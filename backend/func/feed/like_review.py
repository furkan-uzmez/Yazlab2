import mysql.connector

def like_review(connection, activity_id: int, username: str) -> bool:
    """
    Kullanıcı adına göre bir aktiviteyi beğenir veya beğeniyi geri alır (Toggle).
    
    Args:
        connection: Veritabanı bağlantı nesnesi.
        activity_id: Beğenilecek aktivitenin ID'si.
        username: Beğenen kullanıcının adı (örn: 'mehmet123').
        
    Returns:
        bool: İşlem başarılıysa True, başarısızsa veya kullanıcı bulunamazsa False.
    """
    if connection is None:
        return False

    try:
        # dictionary=True kullanarak sütun isimleriyle erişim sağlayalım
        cursor = connection.cursor(dictionary=True)

        # 1. ADIM: Kullanıcı adından user_id'yi bul
        get_user_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(get_user_query, (username,))
        user_data = cursor.fetchone()

        if not user_data:
            print(f"HATA: '{username}' kullanıcısı bulunamadı.")
            cursor.close()
            return False
        
        user_id = user_data['user_id']

        # 2. ADIM: Kullanıcının bu aktiviteyi daha önce beğenip beğenmediğini kontrol et
        check_query = """
            SELECT 1 FROM activities_likes 
            WHERE user_id = %s AND activity_id = %s
        """
        cursor.execute(check_query, (user_id, activity_id))
        exists = cursor.fetchone()

        if exists:
            # --- DURUM 1: Zaten beğenmiş -> BEĞENİYİ KALDIR (UNLIKE) ---
            delete_query = """
                DELETE FROM activities_likes 
                WHERE user_id = %s AND activity_id = %s
            """
            cursor.execute(delete_query, (user_id, activity_id))
            print(f"Kullanıcı {username} ({user_id}), aktivite {activity_id} üzerindeki beğenisini kaldırdı.")
        else:
            # --- DURUM 2: Beğenmemiş -> BEĞENİ EKLE (LIKE) ---
            insert_query = """
                INSERT INTO activities_likes (user_id, activity_id) 
                VALUES (%s, %s)
            """
            cursor.execute(insert_query, (user_id, activity_id))
            print(f"Kullanıcı {username} ({user_id}), aktivite {activity_id}'yi beğendi.")

        # Değişiklikleri kaydet
        connection.commit()
        cursor.close()
        return True

    except mysql.connector.Error as e:
        print(f"HATA: like_review SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: like_review beklenmedik hata: {e}")
        return False