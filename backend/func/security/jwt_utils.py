import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from dotenv import load_dotenv

# .env dosyasını yükle (eğer ana dosyada yüklenmediyse)
load_dotenv()

# .env'den ayarları oku
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256" # Standart imzalama algoritması
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", 15))


def create_reset_token(email: str) -> str:
    """
    Şifre sıfırlama için e-posta'yı içeren, süresi kısıtlı bir JWT oluşturur.
    """
    
    # Token'ın son kullanma tarihini hesapla (örn: 15 dakika sonrası)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Token'ın içine gömülecek veri (payload)
    to_encode = {
        "sub": email,  # 'subject' (kimin için)
        "exp": expire, # 'expiration' (son kullanma tarihi)
        "type": "reset" # Token tipini belirtmek iyi bir pratiktir
    }
    
    # Token'ı GİZLİ anahtar ile imzala
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def validate_reset_token(token: str) -> str | None:
    """
    Gelen token'ı doğrular.
    Geçerliyse (ve süresi dolmamışsa) içindeki e-posta'yı,
    geçersizse None döndürür.
    """
    try:
        # Token'ı GİZLİ anahtar ile çözmeyi dene
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # İçinden 'sub' (email) ve 'exp' (süre) bilgilerini al
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        # Token'ın süresinin dolup dolmadığını 'jwt.decode' zaten kontrol eder.
        # (Süresi dolmuşsa 'ExpiredSignatureError' fırlatır)

        if email is None or token_type != "reset":
            # Token var ama email bilgisi yoksa veya tipi 'reset' değilse
            return None
            
        # Token geçerli ve email alındı
        return email

    except JWTError:
        # Token geçersiz (imza uyuşmuyor, süresi dolmuş vb.)
        return None