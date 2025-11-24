import mysql.connector

def add_rating(connection, user_email: str, content_id, score: float, content_title: str = None, content_type: str = None, cover_url: str = None, api_id: str = None) -> int:
    """
    Bir içeriğe puan ekler ve activity oluşturur.
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

        # 2. ADIM: Bu kullanıcının bu içerik için zaten bir rating'i var mı kontrol et
        check_query = "SELECT rating_id FROM ratings WHERE user_id = %s AND content_id = %s"
        cursor.execute(check_query, (user_id, db_content_id))
        existing_rating = cursor.fetchone()

        if existing_rating:
            # Mevcut rating'i güncelle
            update_query = "UPDATE ratings SET score = %s WHERE rating_id = %s"
            cursor.execute(update_query, (score, existing_rating['rating_id']))
            rating_id = existing_rating['rating_id']
        else:
            # Yeni rating oluştur
            insert_rating_query = """
                INSERT INTO ratings (user_id, content_id, score) 
                VALUES (%s, %s, %s)
            """
            cursor.execute(insert_rating_query, (user_id, db_content_id, score))
            rating_id = cursor.lastrowid

        # 3. ADIM: Aynı kullanıcı ve içerik için review activity'si var mı kontrol et
        # Eğer varsa, rating activity'si oluşturma (review activity'si zaten rating'i de içeriyor)
        check_review_activity_query = """
            SELECT a.activity_id
            FROM activities a
            JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
            WHERE a.user_id = %s AND rev.content_id = %s
        """
        cursor.execute(check_review_activity_query, (user_id, db_content_id))
        existing_review_activity = cursor.fetchone()

        if existing_review_activity:
            # Review activity'si varsa, rating activity'si oluşturma
            # Review activity'si zaten rating'i de içeriyor (get_user_feed sorgusunda)
            activity_id = existing_review_activity['activity_id']
            print(f"Review activity'si mevcut, rating activity'si oluşturulmadı (activity_id: {activity_id}).")
        else:
            # Review activity'si yoksa, rating activity'si kontrol et
            check_activity_query = """
                SELECT activity_id FROM activities 
                WHERE user_id = %s AND type = 'rating' AND reference_id = %s
            """
            cursor.execute(check_activity_query, (user_id, rating_id))
            existing_activity = cursor.fetchone()

            if existing_activity:
                activity_id = existing_activity['activity_id']
            else:
                # Yeni rating activity oluştur
                insert_activity_query = """
                    INSERT INTO activities (user_id, type, reference_id) 
                    VALUES (%s, 'rating', %s)
                """
                cursor.execute(insert_activity_query, (user_id, rating_id))
                activity_id = cursor.lastrowid

        # Değişiklikleri onayla
        connection.commit()
        cursor.close()
        
        print(f"Rating başarıyla eklendi (activity_id: {activity_id}).")
        return activity_id

    except mysql.connector.Error as e:
        print(f"HATA: Rating eklenirken SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False

