from backend.func.db.connection.open_db_connection import open_db_connection

def get_most_commented_movies(page: int = 1, limit: int = 20):
    """
    En çok yorum alan filmleri getirir.
    """
    try:
        connection = open_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        offset = (page - 1) * limit
        
        # Yorum sayısına göre sırala (hem rating hem review aktivitelerindeki yorumlar)
        query = """
            SELECT 
                c.content_id, 
                c.title, 
                c.cover_url, 
                c.release_year, 
                c.type, 
                c.api_id, 
                COUNT(ac.comment_id) as comment_count
            FROM contents c
            LEFT JOIN ratings rat ON c.content_id = rat.content_id
            LEFT JOIN reviews rev ON c.content_id = rev.content_id
            LEFT JOIN activities a ON (
                (a.reference_id = rat.rating_id AND a.type = 'rating') OR
                (a.reference_id = rev.review_id AND a.type = 'review')
            )
            LEFT JOIN activity_comments ac ON a.activity_id = ac.activity_id
            WHERE c.type = 'movie'
            GROUP BY c.content_id
            ORDER BY comment_count DESC
            LIMIT %s OFFSET %s
        """
        
        cursor.execute(query, (limit, offset))
        results = cursor.fetchall()
        
        movies = []
        for row in results:
            movies.append({
                "id": int(row['api_id']) if row['api_id'] and row['api_id'].isdigit() else row['content_id'], # Frontend TMDB ID bekliyor
                "title": row['title'],
                "poster_path": row['cover_url'].replace("https://image.tmdb.org/t/p/w200", "") if row['cover_url'] else None,
                "release_date": f"{row['release_year']}-01-01" if row['release_year'] else None,
                "vote_average": 0, # DB'den ortalama puanı çekmek için ekstra sorgu gerekir, şimdilik 0
                "overview": "",
                "genre_ids": [],
                "comment_count": row['comment_count']
            })
            
        return {"results": movies, "page": page}

    except Exception as e:
        print(f"En çok yorum alan filmler alınırken hata: {e}")
        return None
    finally:
        if connection:
            connection.close()

def get_most_added_movies(page: int = 1, limit: int = 20):
    """
    En çok listeye eklenen filmleri getirir.
    """
    try:
        connection = open_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        offset = (page - 1) * limit
        
        # Listeye eklenme sayısına göre sırala
        query = """
            SELECT 
                c.content_id, 
                c.title, 
                c.cover_url, 
                c.release_year, 
                c.type, 
                c.api_id, 
                COUNT(li.list_id) as add_count
            FROM contents c
            JOIN list_items li ON c.content_id = li.content_id
            WHERE c.type = 'movie'
            GROUP BY c.content_id
            ORDER BY add_count DESC
            LIMIT %s OFFSET %s
        """
        
        cursor.execute(query, (limit, offset))
        results = cursor.fetchall()
        
        movies = []
        for row in results:
            movies.append({
                "id": int(row['api_id']) if row['api_id'] and row['api_id'].isdigit() else row['content_id'],
                "title": row['title'],
                "poster_path": row['cover_url'].replace("https://image.tmdb.org/t/p/w200", "") if row['cover_url'] else None,
                "release_date": f"{row['release_year']}-01-01" if row['release_year'] else None,
                "vote_average": 0,
                "overview": "",
                "genre_ids": [],
                "vote_count": row['add_count'] # Frontend'de vote_count alanını kullanabiliriz veya yeni alan
            })
            
        return {"results": movies, "page": page}

    except Exception as e:
        print(f"En çok listeye eklenen filmler alınırken hata: {e}")
        return None
    finally:
        if connection:
            connection.close()
