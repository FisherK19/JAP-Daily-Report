require('dotenv').config();

let dbConfig, emailConfig;

if (process.env.JAWSDB_URL) {
    const dbUrl = new URL(process.env.JAWSDB_URL);

    dbConfig = {
        host: dbUrl.hostname,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.substr(1),
    };
} else {
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    };
}

emailConfig = {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
};

module.exports = { dbConfig, emailConfig };
