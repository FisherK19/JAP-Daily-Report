const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
require('dotenv').config();
const path = require('path');

const pool = mysql.createPool({
    connectionLimit: 80,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'Templates')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Import admin routes
const adminRegisterRoutes = require('./routes/adminRegister');
const adminLoginRoutes = require('./routes/adminLogin');

// Use admin routes
app.use('/api/admin/register', adminRegisterRoutes);
app.use('/api/admin/login', adminLoginRoutes);

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

app.use(session({
    secret: process.env.SESSION_SECRET,
    key: 'session_cookie_name',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false 
    }
}));

// Import user registration router
const UserRegisterRoutes = require('./routes/UserRegister');
const userLoginRoutes = require('./routes/Userlogin');
const dailyReportRoutes = require('./routes/dailyReport');
const adminUserRoutes = require('./routes/adminUser');
const adminReportRoutes = require('./routes/adminReport');

app.use('/register', UserRegisterRoutes); 
app.use('/login', userLoginRoutes); 
app.use('/daily-report', dailyReportRoutes); 
app.use('/admin/users', adminUserRoutes); 
app.use('/admin/reports', adminReportRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
