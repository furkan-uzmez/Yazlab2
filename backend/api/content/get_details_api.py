from fastapi import APIRouter, HTTPException, status, Query

from backend.func.content.get_movie_details import get_movie_details as get_movie_details_func
from backend.func.content.get_book_details import get_book_details as get_book_details_func
from backend.func.content.get_content_from_db import get_content_from_db
from backend.func.db.connection.open_db_connection import open_db_connection

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/details")
async def get_content_details(
    content_id: str = Query(...),
    content_type: str = Query(...)
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
        # Önce content_id'nin integer olup olmadığını kontrol et
        # Eğer integer ise, veritabanından api_id'yi bul
        api_id = None
        try:
            db_content_id = int(content_id)
            # Veritabanından içerik bilgilerini al
            db_content = get_content_from_db(connection, db_content_id)
            if db_content and db_content.get('api_id'):
                api_id = db_content['api_id']
                # content_type'ı da veritabanından al (daha güvenilir)
                if db_content.get('type'):
                    content_type = db_content['type']
            else:
                # Veritabanında bulunamadı, direkt content_id'yi api_id olarak kullan
                api_id = content_id
        except ValueError:
            # content_id string ise, direkt api_id olarak kullan
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
        
        return {"content": result}
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

