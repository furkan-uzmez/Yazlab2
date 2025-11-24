import mysql.connector

def add_comment_by_content(connection, user_email: str, content_id: int, comment_text: str) -> bool:
    """
    Bir içeriğe (content_id) yorum ekler.
    Eğer içerik için bir aktivite yoksa, bir review aktivitesi oluşturur ve ona yorum ekler.
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
        cursor.execute(rating_query, (content_id, user_id))
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
            cursor.execute(review_query, (content_id, user_id))
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
                cursor.execute(insert_review_query, (user_id, content_id, ""))
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
                INSERT INTO activity_comments (activity_id, user_id, text) 
                VALUES (%s, %s, %s)
            """
            cursor.execute(insert_comment_query, (activity_id, user_id, comment_text))
            
            # Değişiklikleri onayla
            connection.commit()
            cursor.close()
            
            print(f"Yorum başarıyla {content_id} nolu içeriğe eklendi (activity_id: {activity_id}).")
            return True
        else:
            print(f"HATA: {content_id} nolu içerik için aktivite oluşturulamadı.")
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

