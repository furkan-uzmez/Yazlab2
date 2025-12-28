USE social_library;

CREATE TABLE comment_likes (
    user_id INT NOT NULL,
    comment_id INT NOT NULL, -- activity_comments tablosundaki comment_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id), -- Bir kullanıcı bir yorumu sadece bir kez beğenebilir
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES activity_comments(comment_id) ON DELETE CASCADE
);