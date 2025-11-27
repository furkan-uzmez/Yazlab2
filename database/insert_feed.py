import mysql.connector
import json
from pathlib import Path
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.content.fetch_metadata import fetch_metadata
import time

# Dosyaların bulunduğu klasörü bul
SCRIPT_DIR = Path(__file__).resolve().parent
ACTIVITIES_JSON_PATH = SCRIPT_DIR / "activities.json"
# Not: commentsMap.json, mevcut şemayla uyumlu olmadığı için işlenmemiştir.

def get_or_create_content(cursor, title: str, content_type: str) -> int:
    """
    İçeriği API'den arar ve oluşturur.
    Eğer API'de bulunamazsa None döner.
    """
    
    # API'den veri çek
    # JSON'da 'film' veya 'kitap' olarak gelebilir, fetch_metadata bunu handle ediyor
    metadata = fetch_metadata(title, content_type)
    
    if not metadata:
        print(f"    ! Metadata bulunamadı, atlanıyor: {title}")
        return None

    # Determine API source
    api_source = 'tmdb' if metadata['type'] == 'movie' else 'google_books'

    # 1. Önce API ID'sine göre kontrol et
    cursor.execute("SELECT content_id FROM contents WHERE api_id = %s", (metadata['id'],))
    content = cursor.fetchone()
    if content: return content['content_id']
    
    # 2. Yoksa Başlık VE TİP'e göre kontrol et
    cursor.execute(
        "SELECT content_id, api_id FROM contents WHERE title = %s AND type = %s", 
        (metadata['title'], metadata['type'])
    )
    content = cursor.fetchone()
    if content:
        # Eğer varsa ama API ID yoksa güncelle
        if not content['api_id']:
            print(f"    -> Mevcut kayıt güncelleniyor (API ID eklendi): {metadata['title']}")
            cursor.execute(
                """UPDATE contents 
                   SET api_id = %s, cover_url = %s, api_source = %s, description = %s, release_year = %s, duration_or_pages = %s
                   WHERE content_id = %s""",
                (metadata['id'], metadata['poster_url'], api_source, metadata['description'], metadata['release_year'], metadata['duration_or_pages'], content['content_id'])
            )
        return content['content_id']

    # 3. Hiçbiri yoksa yeni oluştur
    print(f"    + Yeni içerik ekleniyor: {metadata['title']} ({metadata['type']})")
    cursor.execute(
        """INSERT INTO contents (title, type, cover_url, api_id, api_source, description, release_year, duration_or_pages) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        (metadata['title'], metadata['type'], metadata['poster_url'], metadata['id'], api_source, metadata['description'], metadata['release_year'], metadata['duration_or_pages'])
    )
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
                # 1. İçerik ID'sini al (veya oluştur) - ARTIK API KULLANIYOR
                content_id = get_or_create_content(
                    cursor, 
                    activity['contentTitle'], 
                    activity['contentType']
                )
                
                if not content_id:
                    print(f"  ! İçerik API'de bulunamadığı için aktivite EKLENMEDİ.")
                    continue

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
                
                # API limitlerine takılmamak için kısa bekleme
                time.sleep(0.2)

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

if __name__ == "__main__":
    insert_mock_activities()