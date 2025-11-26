import mysql.connector

def get_or_create_content(cursor, external_id: str, title: str, poster_url: str, content_type: str, api_source: str = 'user_add'):
    """
    İçeriği bulur veya oluşturur. content_id döndürür.
    """
    # Önce api_id ile kontrol et (external_id olarak geliyor)
    cursor.execute(
        "SELECT content_id FROM contents WHERE api_id = %s",
        (str(external_id),)
    )
    existing = cursor.fetchone()
    
    if existing:
        return existing['content_id']
    
    # Yoksa başlık ve tip ile kontrol et
    cursor.execute(
        "SELECT content_id FROM contents WHERE title = %s AND type = %s",
        (title, content_type)
    )
    existing = cursor.fetchone()
    
    if existing:
        return existing['content_id']
    
    # Yoksa yeni oluştur
    cursor.execute(
        """INSERT INTO contents (api_id, title, cover_url, type, api_source)
           VALUES (%s, %s, %s, %s, %s)""",
        (str(external_id), title, poster_url, content_type, api_source)
    )
    return cursor.lastrowid

def get_or_create_list(cursor, user_id: int, list_name: str):
    """
    Listeyi bulur veya oluşturur. list_id döndürür.
    """
    # Frontend'den gelen list_key'i Türkçe isme çevir
    list_name_mapping = {
        "watched": "İzledim",
        "toWatch": "İzlenecek",
        "read": "Okudum",
        "toRead": "Okunacak"
    }
    
    db_list_name = list_name_mapping.get(list_name, list_name)
    
    cursor.execute(
        "SELECT list_id FROM lists WHERE user_id = %s AND name = %s",
        (user_id, db_list_name)
    )
    existing = cursor.fetchone()
    
    if existing:
        return existing['list_id']
    
    # Yoksa yeni oluştur
    cursor.execute(
        "INSERT INTO lists (user_id, name) VALUES (%s, %s)",
        (user_id, db_list_name)
    )
    return cursor.lastrowid

from typing import Optional

def add_item_to_library(connection, username: str, list_key: str, external_id: str, title: str, poster_url: Optional[str], content_type: str, api_source: str = 'user_add'):
    """
    Kullanıcının kütüphanesine içerik ekler.
    """
    if connection is None:
        return False
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Kullanıcıyı bul
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        
        if not user:
            return False
        
        user_id = user['user_id']
        
        # İçeriği bul veya oluştur
        content_id = get_or_create_content(cursor, external_id, title, poster_url, content_type, api_source)
        
        # Listeyi bul veya oluştur
        list_id = get_or_create_list(cursor, user_id, list_key)
        
        # Listeye ekle (varsa hata vermemesi için IGNORE)
        cursor.execute(
            "INSERT IGNORE INTO list_items (list_id, content_id) VALUES (%s, %s)",
            (list_id, content_id)
        )
        
        connection.commit()
        cursor.close()
        return True
        
    except Exception as e:
        print(f"Kütüphane ekleme hatası: {e}")
        if connection:
            connection.rollback()
        return False
