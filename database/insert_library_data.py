import mysql.connector
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.content.fetch_metadata import fetch_metadata
import time

# React tarafındaki mock veri (Sadece başlıklar ve tipler yeterli olacak)
library_data = {
    "watched": [
        { "title": "Inception", "type": "movie" },
        { "title": "The Matrix", "type": "movie" },
        { "title": "Interstellar", "type": "movie" },
        { "title": "The Dark Knight", "type": "movie" }
    ],
    "toWatch": [
        { "title": "Dune", "type": "movie" },
        { "title": "Blade Runner 2049", "type": "movie" }
    ],
    "read": [
        { "title": "1984", "type": "book" },
        { "title": "Dune", "type": "book" },
        { "title": "The Lord of the Rings", "type": "book" }
    ],
    "toRead": [
        { "title": "Foundation", "type": "book" },
        { "title": "Brave New World", "type": "book" }
    ]
}

# Bu listelerin Türkçe karşılıkları (Veritabanında görünecek isimler)
LIST_NAMES = {
    "watched": "İzledim",
    "toWatch": "İzlenecek",
    "read": "Okudum",
    "toRead": "Okunacak"
}

def get_or_create_content(cursor, item):
    """İçeriği bulur veya oluşturur, content_id döndürür."""
    
    # API'den veri çek
    metadata = fetch_metadata(item['title'], item['type'])
    
    if not metadata:
        print(f"    ! Metadata bulunamadı, veritabanına EKLENMİYOR: {item['title']}")
        return None

    # Determine API source
    api_source = 'tmdb' if metadata['type'] == 'movie' else 'google_books'

    # 1. Önce API ID'sine göre kontrol et (En güvenlisi)
    cursor.execute("SELECT content_id FROM contents WHERE api_id = %s", (metadata['id'],))
    content = cursor.fetchone()
    
    content_id = None
    
    if content: 
        content_id = content['content_id']
    else:
        # 2. Yoksa Başlık VE TİP'e göre kontrol et
        # Eğer başlık eşleşiyorsa ama API ID yoksa, bu kaydı GÜNCELLEMELİYİZ ki API verisiyle eşleşsin.
        cursor.execute(
            "SELECT content_id, api_id FROM contents WHERE title = %s AND type = %s", 
            (metadata['title'], metadata['type'])
        )
        content = cursor.fetchone()
        if content:
            content_id = content['content_id']
            if not content['api_id']:
                print(f"    -> Mevcut kayıt güncelleniyor (API ID eklendi): {metadata['title']}")
                cursor.execute(
                    """UPDATE contents 
                       SET api_id = %s, cover_url = %s, api_source = %s, description = %s, release_year = %s, duration_or_pages = %s
                       WHERE content_id = %s""",
                    (metadata['id'], metadata['poster_url'], api_source, metadata['description'], metadata['release_year'], metadata['duration_or_pages'], content['content_id'])
                )
        else:
            # 3. Hiçbiri yoksa yeni oluştur
            print(f"    + Yeni içerik ekleniyor: {metadata['title']} ({metadata['type']})")
            cursor.execute(
                """INSERT INTO contents (title, type, cover_url, api_id, api_source, description, release_year, duration_or_pages) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (metadata['title'], metadata['type'], metadata['poster_url'], metadata['id'], api_source, metadata['description'], metadata['release_year'], metadata['duration_or_pages'])
            )
            content_id = cursor.lastrowid
    
    # Türleri kaydet
    from backend.func.list.add_to_library import save_genres
    if metadata.get('genres'):
        save_genres(cursor, content_id, metadata['genres'])
        
    return content_id

def get_or_create_list(cursor, user_id, list_name):
    """Kullanıcı için listeyi bulur veya oluşturur."""
    cursor.execute(
        "SELECT list_id FROM lists WHERE user_id = %s AND name = %s", 
        (user_id, list_name)
    )
    lst = cursor.fetchone()
    
    if lst:
        return lst['list_id']
    
    print(f"  -> Liste oluşturuluyor: {list_name}")
    cursor.execute(
        "INSERT INTO lists (user_id, name, is_public) VALUES (%s, %s, TRUE)",
        (user_id, list_name)
    )
    return cursor.lastrowid

def insert_library_for_user(email):
    connection = open_db_connection()
    if not connection:
        return

    try:
        cursor = connection.cursor(dictionary=True)
        
        # 1. Kullanıcıyı Bul
        cursor.execute("SELECT user_id, username FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"HATA: Kullanıcı bulunamadı ({email})")
            return

        user_id = user['user_id']
        print(f"\n--- Kütüphane Oluşturuluyor: {user['username']} ---")

        # 2. Her Kategori İçin İşlem Yap
        for key, items in library_data.items():
            list_name_tr = LIST_NAMES[key]
            print(f"\nListe İşleniyor: {list_name_tr} ({len(items)} öğe)")
            
            # Listeyi bul veya oluştur
            list_id = get_or_create_list(cursor, user_id, list_name_tr)
            
            for item in items:
                # İçeriği bul veya oluştur
                content_id = get_or_create_content(cursor, item)
                
                if content_id:
                    # Listeye ekle (Varsa hata vermemesi için IGNORE)
                    try:
                        cursor.execute(
                            "INSERT IGNORE INTO list_items (list_id, content_id) VALUES (%s, %s)",
                            (list_id, content_id)
                        )
                        if cursor.rowcount > 0:
                            print(f"    -> Listeye eklendi: {item['title']}")
                    except Exception as e:
                        print(f"    ! Liste hatası ({item['title']}): {e}")
                
                # API limitlerine takılmamak için kısa bekleme
                time.sleep(0.2)

        connection.commit()
        print("\n--- İşlem Başarıyla Tamamlandı ---")

    except Exception as e:
        print(f"Genel Hata: {e}")
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    # Test için doğrudan çalıştırıldığında
    insert_library_for_user("mehmet.demir@example.com")