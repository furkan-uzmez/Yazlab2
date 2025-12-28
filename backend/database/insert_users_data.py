import mysql.connector
import json
from pathlib import Path
from func.security.hash_password import hash_password
from func.db.connection.open_db_connection import open_db_connection

SCRIPT_DIR = Path(__file__).resolve().parent
JSON_FILE_PATH = SCRIPT_DIR / "users_data.json"

def insert_initial_data(): # Fonksiyon adını güncelledim
    users_data = []
    
    # 1. JSON DOSYASINI OKU
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            users_data = json.load(f)
            print(f"'{JSON_FILE_PATH.name}' dosyasından {len(users_data)} kullanıcı okundu.")
    except FileNotFoundError:
        print(f"HATA: '{JSON_FILE_PATH}' dosyası bulunamadı.")
        return
    except json.JSONDecodeError:
        print(f"HATA: JSON dosyası bozuk veya formatı yanlış.")
        return
    
    # 2. KULLANICI VERİLERİNİ HAZIRLA (Hash'leme)
    db_ready_users = []
    for user in users_data:
        hashed = hash_password(user["plain_password"])
        db_ready_users.append({
            "username": user["name"].replace(" ", "").lower() + str(user["id"]), 
            "email": user["email"],
            "password_hash": hashed,
            "avatar_url": user["avatar"],
            "bio": user["bio"]
        })

    connection = None 
    cursor = None
    
    try:
        connection = open_db_connection()
        if connection is None:
            print("HATA: Veritabanı bağlantısı kurulamadı. .env dosyanızı kontrol edin.")
            return

        cursor = connection.cursor()
        
        # --- BÖLÜM 1: KULLANICILARI EKLE ---
        print("\n--- Kullanıcılar Ekleniyor ---")
        user_query = """
                INSERT INTO users 
                    (username, email, password_hash, avatar_url, bio) 
                VALUES 
                    (%s, %s, %s, %s, %s)
                """
        for user in db_ready_users:
            try:
                cursor.execute(user_query, (
                    user["username"],
                    user["email"],
                    user["password_hash"],
                    user["avatar_url"],
                    user["bio"]
                ))
                print(f"Başarılı: Kullanıcı eklendi - {user['username']}")
            except mysql.connector.Error as e:
                print(f"UYARI: {user['username']} eklenemedi (muhtemelen zaten var): {e}")

        connection.commit() # Kullanıcıları kaydet
        print("--- Kullanıcı ekleme tamamlandı ---")

        
        # --- BÖLÜM 2: TAKİP İLİŞKİLERİNİ EKLE ---
        print("\n--- Takip İlişkileri Ekleniyor ---")
        
        # (Kullanıcı ID'lerinin 1-7 arasında olduğunu varsayarak)
        follow_relationships = [
            (1, 2), (1, 3), (1, 4),               # Mehmet (1) -> Ayşe, Can, Zeynep'i takip ediyor
            (2, 1), (2, 5), (2, 6), (2, 7), (2, 8), (2, 3),   # Ayşe (2) -> Mehmet, Ali'yi takip ediyor
            (3, 1), (3, 2), (3, 4), (3, 5), (3, 6), # Can (3) -> Neredeyse herkesi takip ediyor
            (4, 1), (4, 3),(4, 2),                       # Zeynep (4) -> Mehmet, Can'ı takip ediyor
            (5, 6), (5, 7),(5, 2),
            (6, 2),                       # Ali (5) -> Fatma, Mustafa'yı takip ediyor
            (7, 1), (7, 2), (7, 3),
            (8, 2)                # Mustafa (7) -> Mehmet, Ayşe, Can'ı takip ediyor
        ]
        
        follow_query = "INSERT INTO follows (follower_id, followed_id) VALUES (%s, %s)"
        
        for follower, followed in follow_relationships:
            try:
                cursor.execute(follow_query, (follower, followed))
                print(f"Başarılı: {follower} -> {followed} takip ilişkisi eklendi.")
            except mysql.connector.Error as e:
                print(f"UYARI: {follower} -> {followed} ilişkisi eklenemedi (muhtemelen zaten var): {e}")

        connection.commit() # Takip ilişkilerini kaydet
        print("--- Takip ilişkileri eklendi ---")
        
    except Exception as e:
        print(f"HATA: 'insert_initial_data' fonksiyonunda ciddi bir hata oluştu: {e}")
        if connection:
            connection.rollback() # Hata olursa TÜM değişiklikleri geri al
    
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("\nVeritabanı bağlantısı kapatıldı.")