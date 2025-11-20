import requests
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_BOOK_API = os.getenv("GOOGLE_BOOK_API")
BASE_URL = "https://www.googleapis.com/books/v1"

def search_book(query: str):
    url = f"{BASE_URL}/volumes"
    params = {
        "q": query,
        "key": GOOGLE_BOOK_API
    }
    r = requests.get(url, params=params)
    
    return r.json()
