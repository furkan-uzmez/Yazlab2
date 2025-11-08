CREATE TABLE contents (
    content_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year YEAR,
    type ENUM('movie', 'book') NOT NULL,
    cover_url VARCHAR(255),
    duration_or_pages INT,
    api_source VARCHAR(50),
    api_id VARCHAR(100)
);