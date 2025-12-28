import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def open_db_connection():
    connection = None  

    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_NAME") 
    
    port_val = os.getenv("DB_PORT")

    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port_val,
            charset='utf8mb4',
            autocommit=True
        )
        print("✅ Veritabanı bağlantısı başarılı!")
    except Error as e:
        print(f"❌ Veritabanı bağlantı hatası: '{e}'")
    
    return connection