import requests
from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API")
BASE_URL = "https://api.themoviedb.org/3"

def get_popular_movies(page: int = 1):
    """
    TMDB API'den popüler filmleri getirir.
    """
    try:
        url = f"{BASE_URL}/movie/popular"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "tr-TR",
            "page": page
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.RequestException as e:
        print(f"TMDB API hatası: {e}")
        return None
    except Exception as e:
        print(f"Popüler filmler alınırken hata: {e}")
        return None

def get_top_rated_movies(page: int = 1):
    """
    TMDB API'den en yüksek puanlı filmleri getirir.
    """
    try:
        url = f"{BASE_URL}/movie/top_rated"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "tr-TR",
            "page": page
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.RequestException as e:
        print(f"TMDB API hatası: {e}")
        return None
    except Exception as e:
        print(f"En yüksek puanlı filmler alınırken hata: {e}")
        return None

def get_now_playing_movies(page: int = 1):
    """
    TMDB API'den şu anda gösterimde olan filmleri getirir.
    """
    try:
        url = f"{BASE_URL}/movie/now_playing"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "tr-TR",
            "page": page
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        return r.json()
    except requests.exceptions.RequestException as e:
        print(f"TMDB API hatası: {e}")
        return None
    except Exception as e:
        print(f"Gösterimdeki filmler alınırken hata: {e}")
        return None

