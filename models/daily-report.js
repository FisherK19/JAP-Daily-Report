CREATE TABLE daily_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    job_number VARCHAR(255),
    TAndM BOOLEAN,
    contract BOOLEAN,
    foreman VARCHAR(255),
    cell_number VARCHAR(255),
    customer VARCHAR(255),
    customer_PO VARCHAR(255),
    job_site VARCHAR(255),
    job_description TEXT,
    job_completion TEXT,
    material_description TEXT,
    equipment_description TEXT,
    hours_worked VARCHAR(255),
    employee VARCHAR(255),
    straight_time VARCHAR(255),
    double_time VARCHAR(255),
    time_and_half VARCHAR(255),
    emergency_purchases TEXT,
    approved_by VARCHAR(255)
  );
  