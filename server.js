const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');
const initDb = require('./config/initializeDB'); 

// Create MySQL connection pool
let pool;
try {
  pool = mysql.createPool({
    connectionLimit: 80,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log('MySQL connection pool created');
} catch (err) {
  console.error('Error creating MySQL connection pool:', err);
  process.exit(1);
}

// Test the database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process with an error code
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
let sessionStore;
try {
  sessionStore = new MySQLStore({
    expiration: 86400000,
    endConnectionOnClose: false,
    createDatabaseTable: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data',
      },
    },
  }, pool);
  console.log('MySQL session store created');
} catch (err) {
  console.error('Error creating MySQL session store:', err);
  process.exit(1);
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  key: 'session_cookie_name',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false, // Change to true if using HTTPS in production
  },
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
app.use('/daily-report', dailyReportRoutes); // This should correctly include the route
app.use('/admin/portal', adminPortalRoutes);
app.use('/admin/reports', adminReportRoutes);
app.use('/users', userRoutes);
app.use('/forgot-password', forgotPasswordRoutes);

// Run database initialization script
initDb().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1); // Exit the process with an error code
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
}).on('error', err => {
  console.error('Server failed to start:', err);
  process.exit(1); 
});
