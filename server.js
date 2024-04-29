const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
require('dotenv').config();
const path = require('path');

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

// Serve static files from the 'templates' directory
app.use(express.static(path.join(__dirname, 'Templates')));


// Serve static assets from the 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
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
    secret: process.env.SESSION_SECRET,
    key: 'session_cookie_name',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: false 
    }
}));

// Variable names to match the required modules
const userRegisterRoutes = require('./routes/Userregister');
const userLoginRoutes = require('./routes/Userlogin');
const dailyReportRoutes = require('./routes/dailyReport');
const adminUserRoutes = require('./routes/adminUser');
const adminReportRoutes = require('./routes/adminReport');

// Correct variable names for app.use
app.use('/api/users/register', userRegisterRoutes);
app.use('/api/users/login', userLoginRoutes);
app.use('/api/daily-reports', dailyReportRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reports', adminReportRoutes);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
