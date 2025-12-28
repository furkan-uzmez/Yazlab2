from func.security.hash_password import hash_password

def register_user(connection, email, password, username):
    try:
        hashed_password = hash_password(password)
        cursor = connection.cursor()
        default_avatar_url = "/default-avatar.png"
        query = "INSERT INTO users (email, password_hash, username, avatar_url) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (email, hashed_password, username, default_avatar_url))

        # 2. Yeni eklenen kullanıcının ID'sini al (Kritik Adım)
        new_user_id = cursor.lastrowid

        # 3. Standart Listeleri Ekle
        if new_user_id:
            insert_standart_lists(cursor, new_user_id)
            
        connection.commit()
        
        return True
    except Exception as e:
        print(f"Error during registration: {e}")
        return False
    finally:
        cursor.close()

def insert_standart_lists(cursor, user_id):
    """
    Verilen user_id için 4 temel listeyi oluşturur.
    Bu fonksiyon register_user içindeki cursor'ı kullanır.
    """
    standard_lists = ["İzledim", "İzlenecek", "Okudum", "Okunacak"]
    
    query = """
        INSERT INTO lists (user_id, name, description, is_public) 
        VALUES (%s, %s, %s, TRUE)
    """
    
    for list_name in standard_lists:
        description = f"{list_name} listesi"
        cursor.execute(query, (user_id, list_name, description))