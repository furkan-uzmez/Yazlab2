import mysql.connector
import json
from pathlib import Path
from datetime import datetime  # <-- 1. DATETIME KÜTÜPHANESİNİ İÇE AKTARIN
from backend.func.db.connection.open_db_connection import open_db_connection

SCRIPT_DIR = Path(__file__).resolve().parent
COMMENTS_JSON_PATH = SCRIPT_DIR / "comments.json"

def insert_mock_comments():
    # ... (try...except bloğu ile JSON okuma kısmı aynı) ...
    try:
        with open(COMMENTS_JSON_PATH, 'r', encoding='utf-8') as f:
            comments_map = json.load(f)
            print(f"'{COMMENTS_JSON_PATH.name}' dosyasından yorum haritası okundu.")
    except Exception as e:
        print(f"HATA: JSON dosyası okunamadı: {e}")
        return

    connection = None
    cursor = None
    
    try:
        connection = open_db_connection()
        if connection is None:
            # ... (hata kısmı aynı)
            return

        cursor = connection.cursor()
        query = """
                INSERT INTO activity_comments 
                    (activity_id, user_id, text, just_content, created_at) 
                VALUES (%s, %s, %s, %s, %s)
                """
        print("\n--- Aktivite Yorumları Ekleniyor ---")
        
        for activity_id, comments_list in comments_map.items():
            for comment in comments_list:
                try:
                    # --- 2. TARİHİ DÖNÜŞTÜR (HATA DÜZELTMESİ) ---
                    iso_date_str = comment['date']
                    # .000Z kısmını at (Python < 3.11 uyumluluğu için)
                    dt_obj = datetime.strptime(iso_date_str.split('.')[0], '%Y-%m-%dT%H:%M:%S')
                    # MySQL'in anlayacağı formata çevir
                    mysql_date_str = dt_obj.strftime('%Y-%m-%d %H:%M:%S')
                    # --- DÖNÜŞTÜRME SONU ---
                    
                    just_content = comment.get('just_content', 0)

                    cursor.execute(query, (
                        int(activity_id),
                        comment['userId'],
                        comment['text'],
                        just_content,
                        mysql_date_str  # <-- 3. DÖNÜŞTÜRÜLMÜŞ TARİHİ KULLAN
                    ))
                    print(f"  -> Yorum eklendi (Aktivite ID: {activity_id}, Kullanıcı: {comment['userName']})")
                except mysql.connector.Error as e:
                    print(f"UYARI: Yorum eklenemedi (muhtemelen zaten var): {e}")

        connection.commit()
        print("--- Tüm mock yorumlar başarıyla veritabanına eklendi. ---")

    except Exception as e:
        # ... (hata kısmı aynı)
        pass
    
    finally:
        # ... (finally bloğu aynı)
        if cursor: cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("Veritabanı bağlantısı kapatıldı.")