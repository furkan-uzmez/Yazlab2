import mysql.connector
from mysql.connector import Error

def open_db_connection(host_name, user_name, user_password, db_name):
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