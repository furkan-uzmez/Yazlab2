import mysql.connector
from backend.func.list.add_to_library import get_or_create_content

def rate_content(connection, user_email: str, content_id: str, score: float, title: str = None, poster_url: str = None, content_type: str = None, genres: list = None) -> bool:
    """
    İçeriği puanlar (ratings tablosuna ekler/günceller) ve aktivite oluşturur.
    """
    if connection is None:
        return False

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. Kullanıcıyı bul
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (user_email,))
        user = cursor.fetchone()

        if not user:
            print(f"HATA: {user_email} kullanıcısı bulunamadı.")
            return False
        
        user_id = user['user_id']

        # 2. İçeriği bul veya oluştur
        # URL uzunluğunu kontrol et
        safe_poster_url = poster_url
        if safe_poster_url and len(safe_poster_url) > 255:
            safe_poster_url = safe_poster_url[:255]
            
        internal_content_id = get_or_create_content(
            cursor, 
            external_id=str(content_id), 
            title=title, 
            poster_url=safe_poster_url, 
            content_type=content_type,
            api_source='tmdb' if content_type == 'movie' else 'google_books',
            genres=genres
        )
        
        if not internal_content_id:
            print("HATA: İçerik oluşturulamadı.")
            return False

        # 3. Puanı kaydet (Varsa güncelle)
        # Önce var mı kontrol et
        cursor.execute(
            "SELECT rating_id FROM ratings WHERE user_id = %s AND content_id = %s",
            (user_id, internal_content_id)
        )
        existing_rating = cursor.fetchone()
        
        rating_id = None
        if existing_rating:
            rating_id = existing_rating['rating_id']
            cursor.execute(
                "UPDATE ratings SET score = %s, created_at = CURRENT_TIMESTAMP WHERE rating_id = %s",
                (score, rating_id)
            )
        else:
            cursor.execute(
                "INSERT INTO ratings (user_id, content_id, score) VALUES (%s, %s, %s)",
                (user_id, internal_content_id, score)
            )
            rating_id = cursor.lastrowid

        # 4. Aktivite oluştur (Eğer yoksa)
        # Rating tipi aktiviteleri kontrol et
        cursor.execute(
            "SELECT activity_id FROM activities WHERE user_id = %s AND type = 'rating' AND reference_id = %s",
            (user_id, rating_id)
        )
        existing_activity = cursor.fetchone()
        
        if not existing_activity:
            cursor.execute(
                "INSERT INTO activities (user_id, type, reference_id) VALUES (%s, 'rating', %s)",
                (user_id, rating_id)
            )

        connection.commit()
        cursor.close()
        return True

    except Exception as e:
        print(f"Puanlama hatası: {e}")
        if connection:
            connection.rollback()
        return False
