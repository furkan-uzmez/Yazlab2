from func.content.search_movie import search_movie
from func.content.search_book import search_book
from func.content.get_movie_details import get_movie_details

def fetch_metadata(title, content_type):
    """
    API'den metadata çeker.
    Bulunursa dict döner: {id, title, poster_url, type, description, release_year, duration_or_pages}
    Bulunamazsa None döner.
    """
    content_type = content_type.lower()
    print(f"    -> API'de aranıyor: {title} ({content_type})")
    try:
        if content_type == 'movie' or content_type == 'film':
            results = search_movie(title)
            if results and results.get('results'):
                first_match = results['results'][0]
                
                # Detaylı bilgi için ikinci bir istek yap (Süre bilgisi için)
                movie_id = first_match['id']
                details = get_movie_details(movie_id)
                runtime = details.get('runtime', 0) if details else 0

                release_date = first_match.get('release_date', '')
                release_year = release_date.split('-')[0] if release_date else None
                
                # Türleri al
                genres = details.get('genres', []) if details else []

                return {
                    "id": str(first_match['id']),
                    "title": first_match['title'],
                    "poster_url": f"https://image.tmdb.org/t/p/w500{first_match['poster_path']}" if first_match.get('poster_path') else None,
                    "type": "movie",
                    "description": first_match.get('overview'),
                    "release_year": release_year,
                    "duration_or_pages": runtime,
                    "genres": genres
                }
        elif content_type == 'book' or content_type == 'kitap':
            results = search_book(title)
            if results and results.get('items'):
                first_match = results['items'][0]
                volume_info = first_match.get('volumeInfo', {})
                image_links = volume_info.get('imageLinks', {})
                published_date = volume_info.get('publishedDate', '')
                release_year = published_date.split('-')[0] if published_date else None
                return {
                    "id": str(first_match['id']),
                    "title": volume_info.get('title', title),
                    "poster_url": image_links.get('thumbnail'),
                    "type": "book",
                    "description": volume_info.get('description'),
                    "release_year": release_year,
                    "duration_or_pages": volume_info.get('pageCount', 0),
                    "genres": volume_info.get('categories', [])
                }
    except Exception as e:
        print(f"    ! API Hatası ({title}): {e}")
    
    return None
