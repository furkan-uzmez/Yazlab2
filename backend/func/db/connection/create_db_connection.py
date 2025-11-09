import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv()

host_name = os.getenv("DB_HOST")
user_name = os.getenv("DB_USER")
user_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")


def create_db_connection():
    connection = None
    
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            password=user_password,
            autocommit=True
        )
        print("Database connecting created successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    
    return connection