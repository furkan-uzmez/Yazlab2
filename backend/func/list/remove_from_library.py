import mysql.connector

def remove_item_from_library(connection, username: str, list_key: str, content_id: int):
    """
    Kullanıcının kütüphanesinden içerik kaldırır.
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
        
        # Frontend'den gelen list_key'i Türkçe isme çevir
        list_name_mapping = {
            "watched": "İzledim",
            "toWatch": "İzlenecek",
            "read": "Okudum",
            "toRead": "Okunacak"
        }
        
        db_list_name = list_name_mapping.get(list_key, list_key)
        
        # Listeyi bul
        cursor.execute(
            "SELECT list_id FROM lists WHERE user_id = %s AND name = %s",
            (user_id, db_list_name)
        )
        list_data = cursor.fetchone()
        
        if not list_data:
            return False
        
        list_id = list_data['list_id']
        
        # Listeden içeriği kaldır
        cursor.execute(
            "DELETE FROM list_items WHERE list_id = %s AND content_id = %s",
            (list_id, content_id)
        )
        
        connection.commit()
        cursor.close()
        return True
        
    except Exception as e:
        print(f"Kütüphane kaldırma hatası: {e}")
        if connection:
            connection.rollback()
        return False
