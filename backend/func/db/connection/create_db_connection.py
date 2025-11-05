import mysql.connector
from mysql.connector import Error

def create_db_connection(host_name, user_name, user_password):
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