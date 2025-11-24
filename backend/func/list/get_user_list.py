import mysql.connector

def get_lists(connection, username: str) -> list:
    """
    Verilen kullanıcı adına ait özel listeleri ve her listedeki öğe sayısını getirir.
    """
    if connection is None:
        return []

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Bu sorgu:
        # 1. Kullanıcı adına göre listeleri filtreler.
        # 2. Her listedeki öğe sayısını (item_count) hesaplar.
        # 3. En son oluşturulan liste en üstte gelecek şekilde sıralar.
        query = """
            SELECT 
                l.list_id, 
                l.name, 
                l.description, 
                l.is_public, 
                l.created_at,
                COUNT(li.content_id) as item_count
            FROM lists l
            JOIN users u ON l.user_id = u.user_id
            LEFT JOIN list_items li ON l.list_id = li.list_id
            WHERE u.username = %s
            GROUP BY l.list_id
            ORDER BY l.created_at DESC
        """
        
        cursor.execute(query, (username,))
        lists = cursor.fetchall()
        
        cursor.close()
        return lists

    except mysql.connector.Error as e:
        print(f"HATA: Listeler çekilemedi (SQL): {e}")
        return []
    except Exception as e:
        print(f"HATA: Listeler çekilemedi (Genel): {e}")
        return []