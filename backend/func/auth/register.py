from backend.func.security.hash_password import hash_password

def register_user(connection, email, password, username):
    try:
        hashed_password = hash_password(password)
        cursor = connection.cursor()
        query = "INSERT INTO users (email, password, username) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, hashed_password, username))
        connection.commit()
        return True
    except Exception as e:
        print(f"Error during registration: {e}")
        return False
    finally:
        cursor.close()