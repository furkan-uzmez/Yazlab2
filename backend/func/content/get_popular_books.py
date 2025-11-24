import requests
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_BOOK_API = os.getenv("GOOGLE_BOOK_API")
BASE_URL = "https://www.googleapis.com/books/v1"

def get_popular_books(max_results: int = 40):
    """
    Google Books API'den popüler kitapları getirir.
    Popüler kitaplar için genel arama yapıyoruz.
    """
    try:
        # Popüler kitaplar için genel arama
        url = f"{BASE_URL}/volumes"
        params = {
            "q": "bestseller OR popular OR classic",
            "key": GOOGLE_BOOK_API,
            "maxResults": max_results,
            "orderBy": "relevance"
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.RequestException as e:
        print(f"Google Books API hatası: {e}")
        return None
    except Exception as e:
        print(f"Popüler kitaplar alınırken hata: {e}")
        return None

def get_new_books(max_results: int = 40):
    """
    Google Books API'den yeni kitapları getirir.
    """
    try:
        url = f"{BASE_URL}/volumes"
        params = {
            "q": "new releases OR 2024 OR 2023",
            "key": GOOGLE_BOOK_API,
            "maxResults": max_results,
            "orderBy": "newest"
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.RequestException as e:
        print(f"Google Books API hatası: {e}")
        return None
    except Exception as e:
        print(f"Yeni kitaplar alınırken hata: {e}")
        return None

