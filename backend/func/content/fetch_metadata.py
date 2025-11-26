
from backend.func.content.search_movie import search_movie
from backend.func.content.search_book import search_book

def fetch_metadata(title, content_type):
    """
    API'den metadata çeker.
    Bulunursa dict döner: {id, title, poster_url, type}
    Bulunamazsa None döner.
    """
    content_type = content_type.lower()
    print(f"    -> API'de aranıyor: {title} ({content_type})")
    try:
        if content_type == 'movie' or content_type == 'film':
            results = search_movie(title)
            if results and results.get('results'):
                first_match = results['results'][0]
                return {
                    "id": str(first_match['id']),
                    "title": first_match['title'],
                    "poster_url": f"https://image.tmdb.org/t/p/w500{first_match['poster_path']}" if first_match.get('poster_path') else None,
                    "type": "movie"
                }
        elif content_type == 'book' or content_type == 'kitap':
            results = search_book(title)
            if results and results.get('items'):
                first_match = results['items'][0]
                volume_info = first_match.get('volumeInfo', {})
                image_links = volume_info.get('imageLinks', {})
                return {
                    "id": str(first_match['id']),
                    "title": volume_info.get('title', title),
                    "poster_url": image_links.get('thumbnail'),
                    "type": "book"
                }
    except Exception as e:
        print(f"    ! API Hatası ({title}): {e}")
    
    return None
