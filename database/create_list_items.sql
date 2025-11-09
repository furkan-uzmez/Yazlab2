CREATE TABLE list_items (
    list_id INT NOT NULL,
    content_id INT NOT NULL,
    PRIMARY KEY (list_id, content_id),
    FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES contents(content_id) ON DELETE CASCADE
);
