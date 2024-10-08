const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');

// Verify environment variables are loaded
if (!process.env.JAWSDB_URL) {
  console.error('Missing JAWSDB_URL environment variable.');
  process.exit(1);
}

// Parse JAWSDB_URL
const parsedUrl = new URL(process.env.JAWSDB_URL);
const username = parsedUrl.username;
const password = parsedUrl.password;
const database = parsedUrl.pathname.substring(1);
const host = parsedUrl.hostname;
const port = parsedUrl.port || 3306;

// Debug logs
console.log(`Parsed DB Details: Host: ${host}, Port: ${port}, User: ${username}, Database: ${database}`);

// Create MySQL connection pool
let pool;
try {
  pool = mysql.createPool({
    connectionLimit: 80,
    host: host,
    port: port,
    user: username,
    password: password,
    database: database,
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
    process.exit(1); 
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
    secure: process.env.NODE_ENV === 'production', 
  },
}));

app.get('/current-user', (req, res) => {
  if (req.session.user) {
      res.json({ username: req.session.user.username });
  } else {
      res.status(401).json({ message: 'No user logged in' });
  }
});

// Import and use route handlers
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
app.use('/admin/portal/report', adminReportRoutes);
app.use('/users', userRoutes);
app.use('/forgot-password', forgotPasswordRoutes);

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Could not log out. Please try again.' });
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});