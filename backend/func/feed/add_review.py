import mysql.connector

def add_review(connection, user_email: str, content_id, review_text: str, content_title: str = None, content_type: str = None, cover_url: str = None, api_id: str = None, rating_score: float = None) -> int:
    """
    Bir içeriğe yorum (review) ekler ve activity oluşturur.
    Eğer içerik veritabanında yoksa, önce içeriği ekler.
    Returns: activity_id veya False
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

        # 1.5. ADIM: İçeriğin veritabanında olup olmadığını kontrol et
        # Önce api_id ile kontrol et (çünkü content_id string olabilir)
        db_content_id = None
        
        # api_id ile içeriği ara
        if api_id:
            cursor.execute("SELECT content_id FROM contents WHERE api_id = %s", (str(api_id),))
            existing_by_api = cursor.fetchone()
            if existing_by_api:
                db_content_id = existing_by_api['content_id']
        
        # Eğer api_id ile bulunamadıysa, content_id ile dene (integer ise)
        if db_content_id is None:
            try:
                int_content_id = int(content_id)
                cursor.execute("SELECT content_id FROM contents WHERE content_id = %s", (int_content_id,))
                existing_content = cursor.fetchone()
                if existing_content:
                    db_content_id = existing_content['content_id']
            except (ValueError, TypeError):
                pass  # content_id string ise, integer'a çevrilemez
        
        # Eğer içerik bulunamadıysa ve content_title verilmişse, içeriği ekle
        if db_content_id is None and content_title and content_type:
            # İçeriği veritabanına ekle
            insert_content_query = """
                INSERT INTO contents (title, type, cover_url, api_id, api_source) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_content_query, (
                content_title, 
                content_type, 
                cover_url or None,
                api_id or str(content_id),
                'tmdb' if content_type == 'movie' else 'google_books'
            ))
            db_content_id = cursor.lastrowid
            print(f"İçerik veritabanına eklendi: {content_title} (content_id: {db_content_id})")
        elif db_content_id is None:
            # İçerik bulunamadı ve yeni içerik de eklenemedi
            print(f"HATA: İçerik bulunamadı ve yeni içerik eklenemedi (content_id: {content_id}, api_id: {api_id})")
            return False

        # 2. ADIM: Eğer rating_score verilmişse, rating'i ekle veya güncelle
        rating_id = None
        if rating_score is not None:
            check_rating_query = "SELECT rating_id FROM ratings WHERE user_id = %s AND content_id = %s"
            cursor.execute(check_rating_query, (user_id, db_content_id))
            existing_rating = cursor.fetchone()

            if existing_rating:
                # Mevcut rating'i güncelle
                update_rating_query = "UPDATE ratings SET score = %s WHERE rating_id = %s"
                cursor.execute(update_rating_query, (rating_score, existing_rating['rating_id']))
                rating_id = existing_rating['rating_id']
            else:
                # Yeni rating oluştur
                insert_rating_query = """
                    INSERT INTO ratings (user_id, content_id, score) 
                    VALUES (%s, %s, %s)
                """
                cursor.execute(insert_rating_query, (user_id, db_content_id, rating_score))
                rating_id = cursor.lastrowid
            print(f"Rating eklendi/güncellendi (rating_id: {rating_id})")

        # 3. ADIM: Aynı kullanıcı ve içerik için rating activity'si var mı kontrol et
        # Eğer varsa, onu sil (çünkü hem rating hem review tek activity'de gösterilecek)
        check_rating_activity_query = """
            SELECT a.activity_id, r.rating_id
            FROM activities a
            JOIN ratings r ON a.reference_id = r.rating_id AND a.type = 'rating'
            WHERE a.user_id = %s AND r.content_id = %s
        """
        cursor.execute(check_rating_activity_query, (user_id, db_content_id))
        existing_rating_activity = cursor.fetchone()
        
        if existing_rating_activity:
            # Rating activity'sini sil (ama rating'i silme, sadece activity'yi sil)
            delete_activity_query = "DELETE FROM activities WHERE activity_id = %s"
            cursor.execute(delete_activity_query, (existing_rating_activity['activity_id'],))
            print(f"Mevcut rating activity'si silindi (activity_id: {existing_rating_activity['activity_id']})")

        # 4. ADIM: Review oluştur
        insert_review_query = """
            INSERT INTO reviews (user_id, content_id, text) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_review_query, (user_id, db_content_id, review_text))
        review_id = cursor.lastrowid

        # 5. ADIM: Review activity'sini oluştur
        insert_activity_query = """
            INSERT INTO activities (user_id, type, reference_id) 
            VALUES (%s, 'review', %s)
        """
        cursor.execute(insert_activity_query, (user_id, review_id))
        activity_id = cursor.lastrowid

        # Değişiklikleri onayla
        connection.commit()
        cursor.close()
        
        print(f"Review başarıyla eklendi (activity_id: {activity_id}).")
        return activity_id

    except mysql.connector.Error as e:
        print(f"HATA: Review eklenirken SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False

