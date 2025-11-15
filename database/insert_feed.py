import mysql.connector
import json
from pathlib import Path
from backend.func.db.connection.open_db_connection import open_db_connection

# Dosyaların bulunduğu klasörü bul
SCRIPT_DIR = Path(__file__).resolve().parent
ACTIVITIES_JSON_PATH = SCRIPT_DIR / "activities.json"
# Not: commentsMap.json, mevcut şemayla uyumlu olmadığı için işlenmemiştir.

def get_or_create_content(cursor, title: str, content_type: str, poster_url: str) -> int:
    """
    İçeriği başlığına göre arar. Bulamazsa oluşturur.
    Her durumda content_id'yi döndürür.
    """
    # Önce içeriğin var olup olmadığını kontrol et
    cursor.execute("SELECT content_id FROM contents WHERE title = %s", (title,))
    content = cursor.fetchone()
    
    if content:
        return content['content_id']
    else:
        # --- HATA DÜZELTMESİ BURADA ---
        
        # 1. 'Film' -> 'movie', 'Kitap' -> 'book' eşleşmesini yap
        if content_type.lower() == 'film':
            db_type = 'movie'
        elif content_type.lower() == 'kitap':
            db_type = 'book'

        print(f"  -> İçerik bulunamadı, '{title}' ({db_type}) oluşturuluyor...")
        
        # 2. 'poster_url' yerine 'cover_url' sütununu kullan
        cursor.execute(
            """INSERT INTO contents (title, type, cover_url) 
               VALUES (%s, %s, %s)""",
            (title, db_type, poster_url) # poster_url değişkeni JSON'dan geliyor
        )
        # --- DÜZELTME SONU ---
        
        return cursor.lastrowid

def insert_mock_activities():
    """
    activities.json dosyasını okur ve verileri
    'contents', 'ratings', 'reviews', 'activities' tablolarına normalize ederek ekler.
    """
    try:
        with open(ACTIVITIES_JSON_PATH, 'r', encoding='utf-8') as f:
            activities_data = json.load(f)
            print(f"'{ACTIVITIES_JSON_PATH.name}' dosyasından {len(activities_data)} aktivite okundu.")
    except FileNotFoundError:
        print(f"HATA: '{ACTIVITIES_JSON_PATH}' dosyası bulunamadı.")
        return
    except json.JSONDecodeError:
        print(f"HATA: JSON dosyası bozuk veya formatı yanlış.")
        return

    connection = None
    cursor = None
    
    try:
        connection = open_db_connection()
        if connection is None:
            print("HATA: Veritabanı bağlantısı kurulamadı.")
            return

        cursor = connection.cursor(dictionary=True) # dictionary=True önemlidir
        
        for activity in activities_data:
            print(f"\nİşleniyor: {activity['userName']} -> {activity['contentTitle']}")
            try:
                # 1. İçerik ID'sini al (veya oluştur)
                content_id = get_or_create_content(
                    cursor, 
                    activity['contentTitle'], 
                    activity['contentType'], 
                    activity['contentPoster']
                )
                
                user_id = activity['userId']
                activity_type = activity['type']
                reference_id = None # Bu, rating_id veya review_id olacak

                # 2. 'ratings' VEYA 'reviews' tablosuna ekle
                if activity_type == 'rating':
                    cursor.execute(
                        """INSERT INTO ratings (user_id, content_id, score) 
                           VALUES (%s, %s, %s)""",
                        (user_id, content_id, activity['rating'])
                    )
                    reference_id = cursor.lastrowid # Oluşan rating_id'yi al
                    print(f"  -> 'ratings' eklendi. (Ref ID: {reference_id})")

                elif activity_type == 'review':
                    cursor.execute(
                        """INSERT INTO reviews (user_id, content_id, text) 
                           VALUES (%s, %s, %s)""",
                        (user_id, content_id, activity['reviewText'])
                    )
                    reference_id = cursor.lastrowid # Oluşan review_id'yi al
                    print(f"  -> 'reviews' eklendi. (Ref ID: {reference_id})")
                
                # 3. Ana 'activities' tablosuna ekle
                if reference_id:
                    cursor.execute(
                        """INSERT INTO activities (user_id, type, reference_id) 
                           VALUES (%s, %s, %s)""",
                        (user_id, activity_type, reference_id)
                    )
                    print(f"  -> 'activities' eklendi.")

            except mysql.connector.Error as e:
                # Hata (örn: 'UNIQUE' kısıtlaması - bu aktivite zaten eklenmiş)
                print(f"UYARI: {activity['contentTitle']} eklenemedi (muhtemelen zaten var): {e}")

        # Her şey yolunda gittiyse, tüm değişiklikleri onayla
        connection.commit()
        print("\n--- Tüm mock aktiviteler başarıyla veritabanına eklendi. ---")

    except Exception as e:
        print(f"HATA: 'insert_mock_activities' fonksiyonunda ciddi bir hata oluştu: {e}")
        if connection:
            connection.rollback() # Hata olursa TÜM değişiklikleri geri al
    
    finally:
        # Hata olsa da olmasa da bağlantıyı güvenle kapat
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("Veritabanı bağlantısı kapatıldı.")