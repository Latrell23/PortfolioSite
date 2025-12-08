-- Portfolio Database Schema

CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- Resume table - stores the current resume file info
CREATE TABLE IF NOT EXISTS resume (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_url VARCHAR(500) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
