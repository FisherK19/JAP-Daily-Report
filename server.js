const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name',
});

// Create Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const dailyReportRoutes = require('./routes/dailyReportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/daily-reports', dailyReportRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
