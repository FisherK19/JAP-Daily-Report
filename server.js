const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Create Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL session store configuration
const sessionStore = new MySQLStore({
    expiration: 86400000, 
    endConnectionOnClose: false,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);

// Express session configuration
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: false 
    }
}));

// Routes
const userRoutes = require('./routes/UserRoutes');
const dailyReportRoutes = require('./routes/DailyReportRoutes');
const adminUserRoutes = require('./routes/AdminUserRoutes');
const adminReportRoutes = require('./routes/AdminReportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/daily-reports', dailyReportRoutes);
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/admin-reports', adminReportRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
