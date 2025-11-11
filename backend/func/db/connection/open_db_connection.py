import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

env_path = os.path.join(os.path.dirname(__file__), '../../../.env')


load_dotenv(env_path)

host_name = os.getenv("DB_HOST")
user_name = os.getenv("DB_USER")
user_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")


def open_db_connection():
    connection = None
    
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            password=user_password,
            database=db_name,
            charset='utf8mb4',
            autocommit=True
        )
        print("Database connection opened successfully")
    except Error as e:
        print(f"The error '{e}' occurred")
    
    return connection