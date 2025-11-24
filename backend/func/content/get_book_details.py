import requests
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_BOOK_API = os.getenv("GOOGLE_BOOK_API")
BASE_URL = "https://www.googleapis.com/books/v1"

def get_book_details(book_id: str):
    """
    Google Books API'den kitap detaylarını getirir.
    """
    try:
        url = f"{BASE_URL}/volumes/{book_id}"
        params = {
            "key": GOOGLE_BOOK_API
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        book_data = r.json()
        
        volume_info = book_data.get('volumeInfo', {})
        
        # Formatlanmış veri döndür
        formatted_data = {
            'id': book_data.get('id'),
            'title': volume_info.get('title', ''),
            'subtitle': volume_info.get('subtitle', ''),
            'authors': volume_info.get('authors', []),
            'description': volume_info.get('description', ''),
            'publishedDate': volume_info.get('publishedDate', ''),
            'pageCount': volume_info.get('pageCount', 0),
            'categories': volume_info.get('categories', []),
            'averageRating': volume_info.get('averageRating', 0),
            'ratingsCount': volume_info.get('ratingsCount', 0),
            'imageLinks': volume_info.get('imageLinks', {}),
            'language': volume_info.get('language', ''),
            'publisher': volume_info.get('publisher', ''),
            'previewLink': volume_info.get('previewLink', ''),
            'infoLink': volume_info.get('infoLink', ''),
            'industryIdentifiers': volume_info.get('industryIdentifiers', [])
        }
        
        return formatted_data
    except requests.exceptions.RequestException as e:
        print(f"Google Books API hatası: {e}")
        return None
    except Exception as e:
        print(f"Kitap detayları alınırken hata: {e}")
        return None

