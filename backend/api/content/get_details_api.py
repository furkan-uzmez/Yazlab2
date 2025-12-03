from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional

from backend.func.content.get_movie_details import get_movie_details as get_movie_details_func
from backend.func.content.get_book_details import get_book_details as get_book_details_func
from backend.func.content.get_content_from_db import get_content_from_db
from backend.func.content.check_user_content_status import check_user_content_status
from backend.func.db.connection.open_db_connection import open_db_connection

from backend.func.list.add_to_library import get_or_create_content
from backend.func.interactions.get_content_rating_stats import get_content_rating_stats

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/details")
async def get_content_details(
    content_id: str = Query(...),
    content_type: str = Query(...),
    username: Optional[str] = Query(None)
):
    """
    İçerik detaylarını getirir.
    Eğer content_id bir integer ise (veritabanı ID'si), önce veritabanından api_id'yi bulur.
    Eğer content_id bir string ise (api_id), direkt API'den çeker.
    
    Kullanım: 
    - GET /content/details?content_id=123&content_type=movie (veritabanı ID'si)
    - GET /content/details?content_id=27205&content_type=movie (TMDB API ID'si)
    - GET /content/details?content_id=OL82565W&content_type=book (Google Books API ID'si)
    """
    connection = open_db_connection()
    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        # İçeriği bulmaya çalış
        # Önce api_id olarak kontrol et (TMDB ID veya Google Books ID)
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM contents WHERE api_id = %s AND type = %s",
            (content_id, content_type)
        )
        db_content = cursor.fetchone()
        
        # Eğer bulunamazsa ve content_id integer ise, veritabanı ID'si olarak kontrol et
        if not db_content:
            try:
                db_id = int(content_id)
                cursor.execute(
                    "SELECT * FROM contents WHERE content_id = %s AND type = %s",
                    (db_id, content_type)
                )
                db_content = cursor.fetchone()
            except ValueError:
                pass
        
        cursor.close()

        api_id = None
        if db_content:
            # Veritabanında bulundu
            api_id = db_content['api_id']
            # User status kontrolü için DB ID'sini kullanabiliriz ama api_id daha genel
        else:
            # Veritabanında yok, direkt API'den çekilecek
            api_id = content_id
        
        # API'den detayları çek
        if content_type == "movie":
            # Movie ID'si integer olmalı
            try:
                movie_id = int(api_id)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Movie ID must be an integer"
                )
            result = get_movie_details_func(movie_id)
        elif content_type == "book":
            # Book ID'si string olabilir
            result = get_book_details_func(api_id)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid content_type. Supported: movie, book."
            )
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Content not found"
            )
        
        # --- DEĞİŞİKLİK: İçeriği veritabanına kaydet (Varsa günceller, yoksa ekler) ---
        try:
            cursor = connection.cursor(dictionary=True)
            
            # API'den gelen verileri hazırla
            poster_url = result.get('poster_path')
            if poster_url and not poster_url.startswith('http'):
                 # TMDB poster path usually needs base url, but get_movie_details might return full url or just path
                 # Let's check get_movie_details return. It returns 'poster_path' as is from TMDB.
                 # Wait, fetch_metadata adds base url. get_movie_details returns raw path?
                 # Let's check get_movie_details again.
                 # It returns 'poster_path': movie_data.get('poster_path')
                 # So it is just /path.jpg
                 if content_type == 'movie':
                     poster_url = f"https://image.tmdb.org/t/p/w500{poster_url}"
            
            # get_book_details returns 'poster_path' which is thumbnail url.
            
            release_year = None
            if result.get('release_date'):
                 release_year = int(result['release_date'].split('-')[0])
            
            duration_or_pages = result.get('runtime') if content_type == 'movie' else result.get('pageCount')
            
            api_source = 'tmdb' if content_type == 'movie' else 'google_books'
            
            get_or_create_content(
                cursor=cursor,
                external_id=str(result['id']), # API ID
                title=result['title'],
                poster_url=poster_url,
                content_type=content_type,
                description=result.get('overview'),
                release_year=release_year,
                duration_or_pages=duration_or_pages,
                api_source=api_source,
                genres=result.get('genres')
            )
            connection.commit()
            cursor.close()
        except Exception as e:
            print(f"İçerik kaydedilirken hata (önemsiz): {e}")
            # Kaydetme hatası akışı bozmamalı
        
        # Kullanıcı durumu kontrolü
        user_status = None
        if username:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            if user:
                user_status = check_user_content_status(
                    connection, 
                    user['user_id'], 
                    str(api_id), 
                    content_type
                )
            cursor.close()
            
        # Rating istatistiklerini al
        rating_stats = get_content_rating_stats(connection, str(api_id), content_type)
        
        return {
            "content": result,
            "user_status": user_status,
            "rating_stats": rating_stats
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve content details"
        )
    finally:
        if connection:
            connection.close()

