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

// Serve static files from the views directory
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
const UserRegisterRoutes = require('./routes/UserRegister');
const UserloginRoutes = require('./routes/Userlogin');
const dailyReportRoutes = require('./routes/dailyReport');
const adminPortalRoutes = require('./routes/adminPortal');
const adminReportRoutes = require('./routes/adminReport');
const adminRegisterRoutes = require('./routes/adminRegister');
const adminLoginRoutes = require('./routes/adminLogin');
const userRoutes = require('./routes/userRoutes');

app.use('/admin/register', adminRegisterRoutes);
app.use('/admin/login', adminLoginRoutes);
app.use('/register', UserRegisterRoutes); 
app.use('/login', UserloginRoutes); 
app.use('/daily-report', dailyReportRoutes); 
app.use('/admin/portal', adminPortalRoutes); 
app.use('/admin/report', adminReportRoutes);  // Ensure this line is included
app.use('/users', userRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve adminportal.html for /admin/portal route
app.get('/admin/portal', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'adminportal.html'));
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out. Please try again.' });
        }
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
