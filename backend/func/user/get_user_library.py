def get_user_library(connection, username: str):
    """
    Belirli bir kullanıcının oluşturduğu listeleri ve bu listelerdeki içerikleri getirir.

    :param connection: MySQL bağlantı nesnesi
    :param username: Kullanıcı adı
    :return: Kullanıcının listeleri ve içerikleri
    """
    try:
        with connection.cursor(dictionary=True) as cursor:
            sql = """
                SELECT 
                    l.list_id,
                    l.name AS list_name,
                    c.content_id,
                    c.title,
                    c.type,
                    c.cover_url,
                    c.release_year
                FROM users u
                JOIN lists l ON u.user_id = l.user_id
                LEFT JOIN list_items li ON l.list_id = li.list_id
                LEFT JOIN contents c ON li.content_id = c.content_id
                WHERE u.username = %s
                ORDER BY l.created_at DESC, c.title;
            """
            cursor.execute(sql, (username,))
            results = cursor.fetchall()

            if not results:
                return None

            # Veriyi liste bazında gruplandıralım (opsiyonel)
            library = {}
            for row in results:
                list_name = row["list_name"]
                if list_name not in library:
                    library[list_name] = []
                if row["content_id"]:
                    library[list_name].append({
                        "content_id": row["content_id"],
                        "title": row["title"],
                        "type": row["type"],
                        "cover_url": row["cover_url"],
                        "release_year": row["release_year"]
                    })
            return library

    except Exception as e:
        print(f"HATA: Kullanıcı kütüphanesi alınırken hata oluştu: {e}")
        raise