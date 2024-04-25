-- Create a table for storing user data
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for storing daily reports
CREATE TABLE daily_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    job_number VARCHAR(50),
    t_and_m BOOLEAN,
    contract BOOLEAN,
    foreman VARCHAR(255),
    cell_number VARCHAR(20),
    customer VARCHAR(255),
    customer_po VARCHAR(50),
    job_site VARCHAR(255),
    job_description VARCHAR(255),
    job_completion VARCHAR(100),
    material_description TEXT,
    equipment_description TEXT,
    emergency_purchases TEXT,
    approved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
