import mysql.connector

def get_user_library(connection, username: str) -> dict:
    """
    Kullanıcının 4 temel kütüphane listesini (watched, toWatch, read, toRead) getirir.
    """
    if connection is None: return {}

    # Frontend'deki anahtarlarla veritabanındaki isimleri eşleştirelim
    # DB'de Türkçe isimler kullanmıştık (insert_library_data.py scriptinde)
    list_mapping = {
        "İzledim": "watched",
        "İzlenecek": "toWatch",
        "Okudum": "read",
        "Okunacak": "toRead"
    }
    
    # Başlangıçta boş yapalım
    library_data = {
        "watched": [], "toWatch": [], "read": [], "toRead": []
    }

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Kullanıcının tüm listelerini ve içindeki içerikleri çek
        # Sadece 4 temel listeyi filtreleyeceğiz
        query = """
            SELECT 
                l.name as list_name,
                c.content_id,
                c.title,
                c.cover_url,
                c.type
            FROM users u
            JOIN lists l ON u.user_id = l.user_id
            JOIN list_items li ON l.list_id = li.list_id
            JOIN contents c ON li.content_id = c.content_id
            WHERE u.username = %s
        """
        
        cursor.execute(query, (username,))
        items = cursor.fetchall()
        cursor.close()

        for item in items:
            db_list_name = item['list_name']
            
            # Eğer bu liste bizim aradığımız temel listelerden biriyse
            if db_list_name in list_mapping:
                frontend_key = list_mapping[db_list_name]
                
                library_data[frontend_key].append({
                    "id": item['content_id'],
                    "title": item['title'],
                    "poster_url": item['cover_url'],
                    "type": item['type']
                })
                
        return library_data

    except Exception as e:
        print(f"Kütüphane çekme hatası: {e}")
        return {}