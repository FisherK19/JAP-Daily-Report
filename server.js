const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');
const initDb = require('./config/intializeDB'); // Ensure this matches the file name

// Create MySQL connection pool
const url = require('url');
const dbUrl = new URL(process.env.JAWSDB_URL);
const pool = mysql.createPool({
    connectionLimit: 80,
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
});

// Test the database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connection successful');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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

// Import routers
const UserRegisterRoutes = require('./routes/Userregister');
const UserloginRoutes = require('./routes/Userlogin');
const dailyReportRoutes = require('./routes/dailyReport');
const adminPortalRoutes = require('./routes/adminPortal');
const adminReportRoutes = require('./routes/adminReport');
const adminRegisterRoutes = require('./routes/adminRegister');
const adminLoginRoutes = require('./routes/adminLogin');
const userRoutes = require('./routes/userRoutes');
const forgotPasswordRoutes = require('./routes/forgotPassword');

app.use('/admin/register', adminRegisterRoutes);
app.use('/admin/login', adminLoginRoutes);
app.use('/register', UserRegisterRoutes); 
app.use('/login', UserloginRoutes); 
app.use('/daily-report', dailyReportRoutes); 
app.use('/admin/portal', adminPortalRoutes); 
app.use('/admin/reports', adminReportRoutes); 
app.use('/users', userRoutes);
app.use('/forgot-password', forgotPasswordRoutes);

// Run database initialization script
initDb();

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out. Please try again.' });
        }
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
