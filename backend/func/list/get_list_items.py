import mysql.connector

def get_list_items(connection, list_id: int) -> list:
    """
    Verilen list_id'ye ait içerikleri getirir.
    """
    if connection is None:
        return []

    try:
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                c.content_id as id,
                c.title,
                c.cover_url as poster_url,
                c.type,
                c.release_year,
                c.description
            FROM list_items li
            JOIN contents c ON li.content_id = c.content_id
            WHERE li.list_id = %s
        """
        
        cursor.execute(query, (list_id,))
        items = cursor.fetchall()
        
        cursor.close()
        return items

    except mysql.connector.Error as e:
        print(f"HATA: Liste içerikleri çekilemedi (SQL): {e}")
        return []
    except Exception as e:
        print(f"HATA: Liste içerikleri çekilemedi (Genel): {e}")
        return []
