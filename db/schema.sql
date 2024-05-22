-- Drop tables if they exist
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS daily_reports;

-- Create a table for storing admin user data
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for storing user data with roles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin TINYINT(1) DEFAULT 0,
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT
);

-- Create a table for storing daily reports with more detailed fields
CREATE TABLE daily_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    job_number VARCHAR(50),
    t_and_m BOOLEAN DEFAULT FALSE,
    contract BOOLEAN DEFAULT FALSE,
    foreman VARCHAR(255),
    cell_number VARCHAR(20),
    customer VARCHAR(255),
    customer_po VARCHAR(50),
    job_site VARCHAR(255),
    job_description TEXT NOT NULL,
    job_completion VARCHAR(100),
    siding VARCHAR(255),
    roofing VARCHAR(255),
    flashing VARCHAR(255),
    miscellaneous VARCHAR(255),
    trucks VARCHAR(255),
    welders VARCHAR(255),
    generators VARCHAR(255),
    compressors VARCHAR(255),
    fuel VARCHAR(255),
    scaffolding VARCHAR(255),
    safety_equipment VARCHAR(255),
    miscellaneous_equipment VARCHAR(255),
    hours_worked DECIMAL(5,2) NOT NULL,
    employee VARCHAR(255) NOT NULL,
    straight_time DECIMAL(5,2) NOT NULL,
    double_time DECIMAL(5,2) NOT NULL,
    time_and_a_half DECIMAL(5,2) NOT NULL,
    emergency_purchases TEXT NOT NULL,
    approved_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255),
    content TEXT,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);
