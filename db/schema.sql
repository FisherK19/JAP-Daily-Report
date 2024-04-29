-- Create a table for storing user data with roles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    job_description TEXT,
    job_completion VARCHAR(100),
    material_description TEXT,
    equipment_description TEXT,
    hours_worked DECIMAL(5,2),
    employee VARCHAR(255),
    straight_time DECIMAL(5,2),
    double_time DECIMAL(5,2),
    time_and_a_half DECIMAL(5,2),
    emergency_purchases TEXT,
    approved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
