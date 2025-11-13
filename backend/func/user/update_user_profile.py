def update_user_profile(connection, new_username: str = None, new_bio: str = None, avatar_url: str = None):
    cursor = connection.cursor()
    
    fields = []
    values = []
    
    if new_username is not None:
        fields.append("username = %s")
        values.append(new_username)
        
    if new_bio is not None:
        fields.append("bio = %s")
        values.append(new_bio)
        
    if avatar_url is not None:
        fields.append("avatar_url = %s")
        values.append(avatar_url)
        
    if not fields:
        return False  # No fields to update
    
    values.append(1)  # Assuming we're updating user with id=1 for simplicity
    sql = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
    
    try:
        cursor.execute(sql, tuple(values))
        connection.commit()
        return True
    except Exception as e:
        print(f"HATA: Kullanıcı profili güncellenemedi: {e}")
        connection.rollback()
        return False