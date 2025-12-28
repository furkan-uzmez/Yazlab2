from func.security.check_password import check_password

def login_control(connection, email, password):
    cursor = connection.cursor()
    
    cursor.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()

    if result is None:
        return False  # Kullanıcı bulunamadı
    

    stored_hashed_password = result[0]

    cursor.close()

    if check_password(password, stored_hashed_password):
        return True  # Giriş başarılı
    else:
        return False  # Parola yanlış
    
