import mysql.connector
from backend.func.db.connection.open_db_connection import open_db_connection

# React tarafındaki mock veri
library_data = {
    "watched": [
        { "id": 27205, "title": "Inception", "poster_url": "https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", "type": "movie" },
        { "id": 603, "title": "The Matrix", "poster_url": "https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "type": "movie" },
        { "id": 157336, "title": "Interstellar", "poster_url": "https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", "type": "movie" },
        { "id": 155, "title": "The Dark Knight", "poster_url": "https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg", "type": "movie" }
    ],
    "toWatch": [
        { "id": 438631, "title": "Dune", "poster_url": "https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIhbkgX2r5Y5D3vT.jpg", "type": "movie" },
        { "id": 335984, "title": "Blade Runner 2049", "poster_url": "https://image.tmdb.org/t/p/w200/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", "type": "movie" }
    ],
    "read": [
        { "id": "OL82565W", "title": "1984", "poster_url": "https://covers.openlibrary.org/b/id/7222246-M.jpg", "type": "book" },
        { "id": "OL82566W", "title": "Dune", "poster_url": "https://covers.openlibrary.org/b/id/8739161-M.jpg", "type": "book" },
        { "id": "OL82567W", "title": "The Lord of the Rings", "poster_url": "https://covers.openlibrary.org/b/id/6979861-M.jpg", "type": "book" }
    ],
    "toRead": [
        { "id": "OL82568W", "title": "Foundation", "poster_url": "https://covers.openlibrary.org/b/id/8739162-M.jpg", "type": "book" },
        { "id": "OL82569W", "title": "Brave New World", "poster_url": "https://covers.openlibrary.org/b/id/7222247-M.jpg", "type": "book" }
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
    
    # 1. Önce API ID'sine göre kontrol et (En güvenlisi)
    cursor.execute("SELECT content_id FROM contents WHERE api_id = %s", (str(item['id']),))
    content = cursor.fetchone()
    if content: return content['content_id']
    
    # 2. Yoksa Başlık VE TİP'e göre kontrol et (DÜZELTME BURADA)
    # Sadece başlık yeterli değil (Dune hem kitap hem film olabilir)
    cursor.execute(
        "SELECT content_id FROM contents WHERE title = %s AND type = %s", 
        (item['title'], item['type'])
    )
    content = cursor.fetchone()
    if content: return content['content_id']

    # 3. Hiçbiri yoksa yeni oluştur
    print(f"  -> İçerik oluşturuluyor: {item['title']} ({item['type']})")
    cursor.execute(
        """INSERT INTO contents (title, type, cover_url, api_id, api_source) 
           VALUES (%s, %s, %s, %s, %s)""",
        (item['title'], item['type'], item['poster_url'], str(item['id']), 'seed_data')
    )
    return cursor.lastrowid

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
                
                # Listeye ekle (Varsa hata vermemesi için IGNORE)
                try:
                    cursor.execute(
                        "INSERT IGNORE INTO list_items (list_id, content_id) VALUES (%s, %s)",
                        (list_id, content_id)
                    )
                    if cursor.rowcount > 0:
                        print(f"    + Eklendi: {item['title']}")
                except Exception as e:
                    print(f"    ! Hata ({item['title']}): {e}")

        connection.commit()
        print("\n--- İşlem Başarıyla Tamamlandı ---")

    except Exception as e:
        print(f"Genel Hata: {e}")
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()