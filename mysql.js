var mysql = require('mysql');
require('dotenv').config();


var connection  = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'bamazon'
})

module.exports = connection;