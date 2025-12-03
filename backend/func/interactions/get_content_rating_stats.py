from backend.func.list.add_to_library import get_or_create_content

def get_content_rating_stats(connection, api_id: str, content_type: str) -> dict:
    """
    İçeriğin ortalama puanını ve oy sayısını getirir.
    """
    if connection is None:
        return {"average_rating": 0, "vote_count": 0}

    try:
        cursor = connection.cursor(dictionary=True)
        
        # 1. İçeriğin veritabanındaki ID'sini bul
        # api_id ve type ile contents tablosundan sorgula
        cursor.execute(
            "SELECT content_id FROM contents WHERE api_id = %s AND type = %s",
            (api_id, content_type)
        )
        content = cursor.fetchone()
        
        if not content:
            # İçerik henüz veritabanında yoksa, henüz oylanmamıştır.
            return {"average_rating": 0, "vote_count": 0}
            
        internal_content_id = content['content_id']
        
        # 2. Ratings tablosundan istatistikleri çek
        cursor.execute(
            """
            SELECT AVG(score) as average_rating, COUNT(*) as vote_count 
            FROM ratings 
            WHERE content_id = %s
            """,
            (internal_content_id,)
        )
        stats = cursor.fetchone()
        cursor.close()
        
        average_rating = 0
        vote_count = 0
        
        if stats:
            if stats['average_rating'] is not None:
                average_rating = float(stats['average_rating'])
            if stats['vote_count'] is not None:
                vote_count = int(stats['vote_count'])
                
        return {
            "average_rating": round(average_rating, 1),
            "vote_count": vote_count
        }

    except Exception as e:
        print(f"Rating stats hatası: {e}")
        return {"average_rating": 0, "vote_count": 0}
