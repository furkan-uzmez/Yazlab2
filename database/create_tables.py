from backend.func.db.connection.create_db_connection import create_db_connection
from pathlib import Path  # <-- 1. GEREKLİ MODÜLÜ İÇERİ AKTARIN

import logging

Path("logs").mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    filename="logs/app.log",   # LOG DOSYASI
    filemode="a",              # ekleme modu
)



SCRIPT_DIR = Path(__file__).resolve().parent


def execute_sql_script_func(conn,file_path):
    cursor = conn.cursor()
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_script = f.read()
    statements = [stmt.strip() for stmt in sql_script.strip().split(';') if stmt.strip()]
    for stmt in statements:
        try:
            cursor.execute(stmt)
        except Exception as e:
            print(f"Hata oluştu: {e} --> {stmt}")
    logger = logging.getLogger(__name__)
    logger.info("%s dosyasındaki SQL sorguları başarıyla çalıştırıldı.", file_path)
    cursor.close()

def create_tables():
    sql_scripts = ['database.sql','user.sql','contents.sql','genres.sql'
                  ,'content_genres.sql','ratings.sql','reviews.sql'
                  ,'lists.sql','list_items.sql','follows.sql'
                  ,'activities.sql','activities_comments.sql']
    try:
        connection = create_db_connection()
    except Exception as e:
        print(f"Veritabanı bağlantısı açılamadı: {e}")
        return
    
    print(connection.cursor())

    for script in sql_scripts:
        script_name = f'create_{script}' # Sizin dosya adlandırma mantığınız (örn: 'create_database.sql')
        
        # --- 3. TAM DOSYA YOLUNU OLUŞTURUN ---
        # Artık 'create_database.sql' yerine
        # '/home/furkan/Projects/Yazlab2/database/create_database.sql' gibi tam bir yol oluşturulacak.
        script_path = SCRIPT_DIR / script_name 
        
        logger = logging.getLogger(__name__)
        logger.info(f"Executing script: {script_path}")
        
        # Dosyanın var olup olmadığını kontrol etmek iyi bir fikirdir
        if not script_path.exists():
            print(f"HATA: Dosya bulunamadı: {script_path}")
            continue # Diğer script'lerle devam et

        execute_sql_script_func(connection, script_path)
    
    connection.close()