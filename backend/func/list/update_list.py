import mysql.connector

def update_list(connection, list_id: int, name: str, description: str) -> bool:
    """
    Listenin adını ve açıklamasını günceller.
    """
    if connection is None:
        return False

    try:
        cursor = connection.cursor()
        
        query = """
            UPDATE lists 
            SET name = %s, description = %s
            WHERE list_id = %s
        """
        
        cursor.execute(query, (name, description, list_id))
        connection.commit()
        
        cursor.close()
        return True

    except mysql.connector.Error as e:
        print(f"HATA: Liste güncellenemedi (SQL): {e}")
        return False
    except Exception as e:
        print(f"HATA: Liste güncellenemedi (Genel): {e}")
        return False
