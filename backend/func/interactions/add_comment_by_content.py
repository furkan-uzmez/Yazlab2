import mysql.connector
from backend.func.list.add_to_library import get_or_create_content

def add_comment_by_content(connection, user_email: str, content_id: str, comment_text: str, title: str = None, poster_url: str = None, content_type: str = None) -> bool:
    """
    Bir içeriğe (content_id) yorum ekler.
    Eğer içerik veritabanında yoksa oluşturur.
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
        print(f"DEBUG: User found: {user_id}")
        print(f"DEBUG: Processing content_id: {content_id}, title: {title}, type: {content_type}")

        # 1.5 ADIM: İçeriği bul veya oluştur (Internal ID'yi al)
        # Eğer title ve type varsa get_or_create_content kullan, yoksa direkt content_id'yi internal varsay
        if title and content_type:
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
                api_source='tmdb' if content_type == 'movie' else 'google_books' # Basit varsayım
            )
            print(f"DEBUG: get_or_create_content returned: {internal_content_id}")
        else:
            # Metadata yoksa, content_id'nin internal olduğunu varsayıyoruz (eski davranış)
            # Ancak string gelirse int'e çevirmeliyiz
            try:
                internal_content_id = int(content_id)
                print(f"DEBUG: Using provided content_id as internal: {internal_content_id}")
            except ValueError:
                print(f"HATA: Metadata eksik ve content_id ({content_id}) integer değil.")
                return False

        # 2. ADIM: İçerik için mevcut bir aktivite var mı kontrol et
        # Önce rating aktivitesi, sonra review aktivitesi kontrol et
        activity_id = None
        
        # Rating aktivitesi var mı?
        rating_query = """
            SELECT a.activity_id 
            FROM activities a
            JOIN ratings r ON a.reference_id = r.rating_id AND a.type = 'rating'
            WHERE r.content_id = %s AND a.user_id = %s
            ORDER BY a.created_at DESC
            LIMIT 1
        """
        cursor.execute(rating_query, (internal_content_id, user_id))
        rating_activity = cursor.fetchone()
        
        if rating_activity:
            activity_id = rating_activity['activity_id']
        else:
            # Review aktivitesi var mı?
            review_query = """
                SELECT a.activity_id 
                FROM activities a
                JOIN reviews rev ON a.reference_id = rev.review_id AND a.type = 'review'
                WHERE rev.content_id = %s AND a.user_id = %s
                ORDER BY a.created_at DESC
                LIMIT 1
            """
            cursor.execute(review_query, (internal_content_id, user_id))
            review_activity = cursor.fetchone()
            
            if review_activity:
                activity_id = review_activity['activity_id']
            else:
                # Hiç aktivite yoksa, yeni bir review aktivitesi oluştur
                # Önce review oluştur
                insert_review_query = """
                    INSERT INTO reviews (user_id, content_id, text) 
                    VALUES (%s, %s, %s)
                """
                cursor.execute(insert_review_query, (user_id, internal_content_id, ""))
                review_id = cursor.lastrowid
                
                # Sonra aktivite oluştur
                insert_activity_query = """
                    INSERT INTO activities (user_id, type, reference_id) 
                    VALUES (%s, 'review', %s)
                """
                cursor.execute(insert_activity_query, (user_id, review_id))
                activity_id = cursor.lastrowid

        # 3. ADIM: Yorumu 'activity_comments' tablosuna ekle
        if activity_id:
            insert_comment_query = """
                INSERT INTO activity_comments (activity_id, user_id, text, just_content) 
                VALUES (%s, %s, %s, 1)
            """
            cursor.execute(insert_comment_query, (activity_id, user_id, comment_text))
            
            # Değişiklikleri onayla
            connection.commit()
            cursor.close()
            
            print(f"Yorum başarıyla {internal_content_id} nolu içeriğe eklendi (activity_id: {activity_id}).")
            return True
        else:
            print(f"HATA: {internal_content_id} nolu içerik için aktivite oluşturulamadı.")
            cursor.close()
            return False

    except mysql.connector.Error as e:
        print(f"HATA: Yorum eklenirken SQL hatası: {e}")
        if connection:
            connection.rollback()
        return False
    except Exception as e:
        print(f"HATA: Beklenmedik hata: {e}")
        return False

