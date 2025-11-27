import unicodedata

def check_user_content_status(connection, user_id: int, api_id: str, content_type: str):
    """
    Kullanıcının belirli bir içerikle ilgili durumunu (izledi mi, izleyecek mi, hangi listelerde) kontrol eder.
    """
    if connection is None:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # İçeriğin veritabanındaki ID'sini bul
        cursor.execute(
            "SELECT content_id FROM contents WHERE api_id = %s AND type = %s",
            (api_id, content_type)
        )
        content = cursor.fetchone()

        print('content',content)
        
        if not content:
            return {
                "is_watched": False,
                "is_to_watch": False,
                "in_lists": []
            }
            
        content_id = content['content_id']
        
        # Kullanıcının listelerini ve bu içerik var mı kontrol et
        # lists tablosu: list_id, user_id, name (watched, to_watch, custom...)
        # list_items tablosu: list_id, content_id
        
        query = """
            SELECT l.name, l.list_id
            FROM lists l
            JOIN list_items li ON l.list_id = li.list_id
            WHERE l.user_id = %s AND li.content_id = %s
        """
        
        cursor.execute(query, (user_id, content_id))
        results = cursor.fetchall()
        
        print('results',results)

        is_watched = False
        is_to_watch = False
        in_lists = []
        
        for row in results:
            print(row)
            list_name = row['name'].lower().strip()
            in_lists.append(row['list_id'])
            
            list_name = unicodedata.normalize("NFC", list_name)

            # Birleşik nokta karakterini at
            list_name = list_name.replace('\u0307', '')

            # Tekrar normal forma getir
            list_name = unicodedata.normalize("NFC", list_name)

            print(list_name)
            print(list_name == "izledim")

            if list_name == "izledim":
                is_watched = True
            elif list_name == 'izlenecek':
                is_to_watch = True
                
        return {
            "is_watched": is_watched,
            "is_to_watch": is_to_watch,
            "in_lists": in_lists
        }
        
    except Exception as e:
        print(f"Check status error: {e}")
        return None
