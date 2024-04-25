// adminUser.js

const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Define the roles here
    default: 'user'
  }
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
