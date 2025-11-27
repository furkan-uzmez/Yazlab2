import mysql.connector

def delete_custom_list(connection, username: str, list_id: int):
    """
    Kullanıcının özel listesini siler.
    """
    if connection is None:
        return {"success": False, "message": "Database connection failed"}
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Kullanıcıyı bul
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        
        if not user:
            return {"success": False, "message": "User not found"}
        
        user_id = user['user_id']
        
        # Liste kullanıcıya mı ait kontrol et
        cursor.execute(
            "SELECT list_id FROM lists WHERE list_id = %s AND user_id = %s",
            (list_id, user_id)
        )
        existing_list = cursor.fetchone()
        
        if not existing_list:
            return {"success": False, "message": "List not found or does not belong to user"}
        
        # Listeyi sil (list_items tablosundaki kayıtlar CASCADE ile silinmeli, 
        # eğer CASCADE yoksa önce onları silmek gerekir. Güvenlik için önce itemları siliyoruz)
        cursor.execute("DELETE FROM list_items WHERE list_id = %s", (list_id,))
        
        # Listeyi sil
        cursor.execute("DELETE FROM lists WHERE list_id = %s", (list_id,))
        
        connection.commit()
        cursor.close()
        
        return {
            "success": True, 
            "message": "List deleted successfully"
        }
        
    except Exception as e:
        print(f"Delete list error: {e}")
        if connection:
            connection.rollback()
        return {"success": False, "message": str(e)}
