import mysql.connector

def get_content_from_db(connection, content_id: int):
    """
    Veritabanından içerik bilgilerini getirir (api_id dahil).
    """
    if connection is None:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT content_id, api_id, type, title FROM contents WHERE content_id = %s",
            (content_id,)
        )
        content = cursor.fetchone()
        cursor.close()
        return content
    except Exception as e:
        print(f"HATA: Veritabanından içerik alınamadı: {e}")
        return None

