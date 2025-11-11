from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from backend.func.security.hash_password import hash_password
from dotenv import load_dotenv
import os

load_dotenv()



async def send_reset_email(email: str, token: str):
    conf = ConnectionConfig(
        MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
        MAIL_FROM = os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),  # Gmail/Google için bu bir "Uygulama Şifresi" olmalıdır
        MAIL_PORT = int(os.getenv("MAIL_PORT", 587)), # .env'de yoksa varsayılan 587
        MAIL_SERVER = os.getenv("MAIL_SERVER"),
        MAIL_STARTTLS = True,  # Sunucuya göre değişir (Gmail için True)
        MAIL_SSL_TLS = False,  # Sunucuya göre değişir (Gmail için False)
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # 2. Linki bu değişkene göre dinamik olarak oluşturun
    reset_link = f"{frontend_url}/sifre-sifirla?token={token}"

    # 3. HTML formatında bir e-posta gövdesi oluşturun
    html_body = f"""
    <html>
    <body>
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayın:</p>
        
        <a href="{reset_link}" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
           Şifremi Sıfırla
        </a>
        
        <p>Eğer bu link çalışmazsa, aşağıdaki adresi kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
        <p>{reset_link}</p>
        
        <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelin.</p>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=html_body, # Link ayarlanmalı
        subtype="html"
    )

    fm = FastMail(conf)

    try:
        # E-posta göndermek için 'await' kullanılmalı
        await fm.send_message(message)
        
        # Eğer bu satıra gelinirse, e-posta başarıyla gönderilmiştir
        print(f"E-posta başarıyla {email} adresine gönderildi.")
        return True
        
    except Exception as e:
        # Hata oluşursa (örn: yanlış şifre, sunucu hatası)
        print(f"HATA: E-posta gönderilemedi: {e}")
        return False    


def update_password(connection, password, email) -> bool:
    """
    Bir kullanıcının şifresini veritabanında günceller.
    Başarılıysa True, başarısızsa False döndürür.
    """
    try:
        # 1. Şifreyi GÜVENLİ bir şekilde hash'leyin
        hashed_password = hash_password(password) # Kendi hash fonksiyonunuz
        
        # 2. 'with' kullanarak cursor'ı güvenle yönetin
        with connection.cursor() as cursor:
            
            # 3. GÜVENLİK: 'password' değil, 'password_hash' sütununu güncelleyin
            query = "UPDATE users SET password_hash = %s WHERE email = %s"
            
            cursor.execute(query, (hashed_password, email))
            
            # 4. Değişiklikleri veritabanına işleyin
            connection.commit()
            
            # 5. Güncellemenin gerçekten bir satırı etkileyip etkilemediğini kontrol edin
            if cursor.rowcount > 0:
                print(f"Başarılı: {email} için şifre güncellendi.")
                return True
            else:
                # Sorgu çalıştı ama hiçbir kullanıcı güncellenmedi (örn: e-posta bulunamadı)
                print(f"Başarısız: {email} adında bir kullanıcı bulunamadı.")
                return False

    except Exception as e:
        # 6. Herhangi bir hata (bağlantı, sorgu, hash) olursa yakalayın
        print(f"HATA: Şifre güncellenirken bir hata oluştu: {e}")
        # Hata durumunda değişiklikleri geri al (opsiyonel ama iyi bir pratik)
        connection.rollback() 
        return False
