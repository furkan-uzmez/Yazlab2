def get_user(connection,user_name: str):    
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (user_name,))
    user_data = cursor.fetchone()
        
    if user_data is not None:
        return user_data
    else:
        return None