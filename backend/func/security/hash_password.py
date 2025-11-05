import bcrypt

def hash_password(password: str) -> str:
    # Parolayı byte'a çevir
    password_bytes = password.encode('utf-8')
    
    # Otomatik salt oluştur
    salt = bcrypt.gensalt()
    
    # Hash işlemi
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Byte'tan string'e dönüştür
    return hashed.decode('utf-8')
