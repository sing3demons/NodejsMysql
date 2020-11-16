const Config = require('../config/index')
const mysql2 = require('mysql2');
const mysql = mysql2.createConnection({
  host: Config.DB_HOST,
  user: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DATABASE
});

module.exports = mysql