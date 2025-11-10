from backend.func.db.connection.open_db_connection import open_db_connection

def get_user(user_name: str):
    connection = open_db_connection()
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (user_name,))
    user_data = cursor.fetchone()
    
    connection.close()
    
    if user_data is not None:
        return user_data
    else:
        return None