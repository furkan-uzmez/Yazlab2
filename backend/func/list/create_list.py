import mysql.connector

def create_custom_list(connection, username: str, list_name: str, description: str = None):
    """
    Kullanıcı için yeni bir özel liste oluşturur.
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
        
        # Aynı isimde liste var mı kontrol et
        cursor.execute(
            "SELECT list_id FROM lists WHERE user_id = %s AND name = %s",
            (user_id, list_name)
        )
        existing = cursor.fetchone()
        
        if existing:
            return {"success": False, "message": "List with this name already exists"}
        
        # Yeni liste oluştur
        cursor.execute(
            "INSERT INTO lists (user_id, name, description, is_public) VALUES (%s, %s, %s, TRUE)",
            (user_id, list_name, description)
        )
        
        list_id = cursor.lastrowid
        connection.commit()
        cursor.close()
        
        return {
            "success": True, 
            "message": "List created successfully",
            "list_id": list_id,
            "name": list_name,
            "description": description
        }
        
    except Exception as e:
        print(f"Create list error: {e}")
        if connection:
            connection.rollback()
        return {"success": False, "message": str(e)}
