import mysql.connector

def remove_item_from_library(connection, username: str, list_key: str, content_id: int, list_id: int = None):
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
        
        # Listeyi bul
        if list_id:
            target_list_id = list_id
        else:
            # Frontend'den gelen list_key'i Türkçe isme çevir
            list_name_mapping = {
                "watched": "İzledim",
                "toWatch": "İzlenecek",
                "read": "Okudum",
                "toRead": "Okunacak"
            }
            db_list_name = list_name_mapping.get(list_key, list_key)
            
            cursor.execute(
                "SELECT list_id FROM lists WHERE user_id = %s AND name = %s",
                (user_id, db_list_name)
            )
            existing_list = cursor.fetchone()
            
            if not existing_list:
                return False
            
            target_list_id = existing_list['list_id']
        
        # Listeden kaldır
        cursor.execute(
            "DELETE FROM list_items WHERE list_id = %s AND content_id = %s",
            (target_list_id, content_id)
        )
        
        connection.commit()
        cursor.close()
        return True
        
    except Exception as e:
        print(f"Kütüphane kaldırma hatası: {e}")
        if connection:
            connection.rollback()
        return False
