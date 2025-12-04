def get_content_comment_count(connection, api_id: str, content_type: str) -> int:
    """
    Belirli bir içerik (api_id + type) için uygulamadaki toplam yorum sayısını döndürür.
    Yorumlar, o içeriğe ait tüm aktiviteler (rating/review) üzerindeki
    activity_comments kayıtlarının sayısıdır.
    """
    if connection is None:
        return 0

    try:
        cursor = connection.cursor(dictionary=True)

        # 1. İçeriğin veritabanındaki internal content_id'sini bul
        cursor.execute(
            "SELECT content_id FROM contents WHERE api_id = %s AND type = %s",
            (str(api_id), content_type)
        )
        content_row = cursor.fetchone()

        if not content_row:
            cursor.close()
            # İçerik henüz sistemde yoksa yorum yoktur
            return 0

        internal_content_id = content_row["content_id"]

        # 2. Bu içeriğe ait aktiviteler üzerinden toplam yorum sayısını hesapla
        query = """
            SELECT COUNT(*) AS comment_count
            FROM activity_comments ac
            JOIN activities a ON ac.activity_id = a.activity_id
            LEFT JOIN ratings r 
                ON a.reference_id = r.rating_id AND a.type = 'rating'
            LEFT JOIN reviews rev 
                ON a.reference_id = rev.review_id AND a.type = 'review'
            WHERE COALESCE(r.content_id, rev.content_id) = %s
        """
        cursor.execute(query, (internal_content_id,))
        row = cursor.fetchone()
        cursor.close()

        if not row or row.get("comment_count") is None:
            return 0

        return int(row["comment_count"])

    except Exception as e:
        print(f"Yorum sayısı hesaplanırken hata: {e}")
        return 0


