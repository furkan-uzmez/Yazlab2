import mysql.connector

def add_comment(connection, user_email: str, content_id: int, comment_text: str) -> bool:
    """
    Bir içeriğe yorum ekler ve bu eylemi 'activities' tablosuna kaydeder.
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

        # 2. ADIM: Yorumu 'reviews' tablosuna ekle
        # (Sütun adları şemanıza göre düzeltildi: user_id, content_id, text)
        insert_review_query = """
            INSERT INTO reviews (user_id, content_id, text) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_review_query, (user_id, content_id, comment_text))
        
        # Eklenen yorumun ID'sini al (Aktivite tablosu için gerekli)
        new_review_id = cursor.lastrowid

        # 3. ADIM: Bu eylemi 'activities' tablosuna kaydet
        # type='review', reference_id=new_review_id
        insert_activity_query = """
            INSERT INTO activities (user_id, type, reference_id) 
            VALUES (%s, 'review', %s)
        """
        cursor.execute(insert_activity_query, (user_id, new_review_id))

        # Hepsini tek seferde onayla
        connection.commit()
        cursor.close()
        
        print("Yorum başarıyla eklendi ve akışa işlendi.")
        return True

    except mysql.connector.Error as e:
        print(f"HATA: Yorum eklenirken SQL hatası: {e}")
        if connection:
            connection.rollback() # Hata olursa işlemleri geri al
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False