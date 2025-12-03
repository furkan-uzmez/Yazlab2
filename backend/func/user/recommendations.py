import mysql.connector

def get_recommended_users(connection, user_id: int, limit: int = 4) -> list:
    """
    Get recommended users for a given user.
    Recommendations are users that the current user is NOT following.
    Results are randomized and limited.
    
    Args:
        connection: Database connection object.
        user_id: ID of the user requesting recommendations.
        limit: Maximum number of users to return.
        
    Returns:
        list: List of dictionaries containing user details.
    """
    if connection is None:
        return []

    try:
        cursor = connection.cursor(dictionary=True)
        
        # 1. Get users NOT followed by current user
        # 2. Randomize
        # 3. Limit
        # 4. For each, get basic info + mutual count
        
        # Note: Mutual followers are users that I follow AND they follow the recommended user.
        # Let's try to do this efficiently.
        # For a recommended user R:
        # Mutuals = Count(U) where (Me -> U) AND (U -> R)
        
        query = """
            SELECT 
                u.user_id,
                u.username as name,
                u.avatar_url as avatar,
                
                (SELECT COUNT(*) FROM follows f1 WHERE f1.followed_id = u.user_id) AS followers_count,
                
                (
                    SELECT COUNT(*) 
                    FROM follows f_me_to_u 
                    JOIN follows f_u_to_target ON f_me_to_u.followed_id = f_u_to_target.follower_id
                    WHERE f_me_to_u.follower_id = %s 
                    AND f_u_to_target.followed_id = u.user_id
                ) AS mutual_count

            FROM users u
            WHERE u.user_id != %s
            AND u.user_id NOT IN (
                SELECT followed_id FROM follows WHERE follower_id = %s
            )
            ORDER BY RAND()
            LIMIT %s
        """
        
        cursor.execute(query, (user_id, user_id, user_id, limit))
        recommendations = cursor.fetchall()
        
        cursor.close()
        
        # Format the output to match frontend expectations if needed, 
        # but the query already returns 'name', 'avatar'.
        # Frontend expects: id, name, avatar, followers (string), mutual (string)
        
        formatted_recommendations = []
        for user in recommendations:
            formatted_recommendations.append({
                "id": user['user_id'],
                "name": user['name'],
                "avatar": user['avatar'],
                "followers": f"{user['followers_count']} takipçi",
                "mutual": f"{user['mutual_count']} ortak takipçi"
            })
            
        return formatted_recommendations

    except mysql.connector.Error as e:
        print(f"HATA: get_recommended_users SQL hatası: {e}")
        return []
    except Exception as e:
        print(f"HATA: get_recommended_users beklenmedik hata: {e}")
        return []
