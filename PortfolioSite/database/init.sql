-- Portfolio Database Schema

CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack JSON,
    features JSON,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project images table
CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Insert seed data for Student Prayer project
INSERT INTO projects (title, description, tech_stack, features, display_order) VALUES
(
    'Student Prayer',
    'A faith-centered mobile application designed for K-12 students to build a consistent prayer life and connect with their school community through shared spiritual experiences.',
    '["React Native", "Firebase", "iOS", "Android"]',
    '[
        {"icon": "🙏", "title": "Prayer Requests", "description": "Students can submit prayer requests and pray for their peers"},
        {"icon": "📺", "title": "Faith Tube", "description": "TikTok-style Christian content feed for faith inspiration"},
        {"icon": "✨", "title": "Testimonies", "description": "Share answered prayers with those who prayed for you"},
        {"icon": "🏆", "title": "Achievements", "description": "Earn levels and badges for consistent prayer habits"},
        {"icon": "📓", "title": "Prayer Journal", "description": "Document and reflect on your spiritual journey"}
    ]',
    1
);
