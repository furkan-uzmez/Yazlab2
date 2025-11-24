import requests
from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API")
BASE_URL = "https://api.themoviedb.org/3"

def get_movie_details(movie_id: int):
    """
    TMDB API'den film detaylarını getirir.
    """
    try:
        # Film detaylarını getir
        url = f"{BASE_URL}/movie/{movie_id}"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "tr-TR",
            "append_to_response": "credits,videos"
        }
        r = requests.get(url, params=params)
        r.raise_for_status()
        movie_data = r.json()
        
        # Yönetmenleri ve oyuncuları çıkar
        directors = []
        cast = []
        
        if 'credits' in movie_data:
            crew = movie_data['credits'].get('crew', [])
            directors = [person['name'] for person in crew if person.get('job') == 'Director']
            
            cast_list = movie_data['credits'].get('cast', [])
            cast = [actor['name'] for actor in cast_list[:10]]  # İlk 10 oyuncu
        
        # Türleri çıkar
        genres = [genre['name'] for genre in movie_data.get('genres', [])]
        
        # Formatlanmış veri döndür
        formatted_data = {
            'id': movie_data.get('id'),
            'title': movie_data.get('title'),
            'poster_path': movie_data.get('poster_path'),
            'backdrop_path': movie_data.get('backdrop_path'),
            'release_date': movie_data.get('release_date'),
            'vote_average': movie_data.get('vote_average', 0),
            'overview': movie_data.get('overview', ''),
            'runtime': movie_data.get('runtime', 0),
            'genres': genres,
            'directors': directors,
            'cast': cast,
            'tagline': movie_data.get('tagline', ''),
            'production_companies': [company['name'] for company in movie_data.get('production_companies', [])],
            'production_countries': [country['name'] for country in movie_data.get('production_countries', [])],
            'spoken_languages': [lang['name'] for lang in movie_data.get('spoken_languages', [])],
            'budget': movie_data.get('budget', 0),
            'revenue': movie_data.get('revenue', 0),
            'status': movie_data.get('status', ''),
            'videos': movie_data.get('videos', {}).get('results', [])
        }
        
        return formatted_data
    except requests.exceptions.RequestException as e:
        print(f"TMDB API hatası: {e}")
        return None
    except Exception as e:
        print(f"Film detayları alınırken hata: {e}")
        return None

