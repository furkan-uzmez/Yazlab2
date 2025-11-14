import requests
from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API")
BASE_URL = "https://api.themoviedb.org/3"

def search_movie(query: str):
    url = f"{BASE_URL}/search/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "query": query,
        "language": "tr-TR"
    }
    r = requests.get(url, params=params)
    return r.json()
