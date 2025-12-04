def get_content_list_count(connection, content_id: str, content_type: str) -> int:
    """
    Bir içeriğin kaç kez listeye eklendiğini döndürür.
    """
    if connection is None:
        return 0

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Internal ID'yi bul (veya API ID ise dönüştür)
        # Bu fonksiyon genellikle API ID ile çağrılır, bu yüzden önce contents tablosundan internal ID'yi bulmalıyız.
        # Ancak list_items tablosu content_id (internal) kullanır.
        
        # Önce contents tablosundan api_id'ye göre content_id'yi bul
        find_query = "SELECT content_id FROM contents WHERE api_id = %s AND type = %s"
        cursor.execute(find_query, (content_id, content_type))
        content = cursor.fetchone()
        
        if not content:
            return 0
            
        internal_id = content['content_id']
        
        # Listeye eklenme sayısını say
        count_query = "SELECT COUNT(*) as count FROM list_items WHERE content_id = %s"
        cursor.execute(count_query, (internal_id,))
        result = cursor.fetchone()
        
        return result['count'] if result else 0

    except Exception as e:
        print(f"List count alınırken hata ({content_id}): {e}")
        return 0
    finally:
        cursor.close()
