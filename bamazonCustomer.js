var mysql = require('mysql');
var inquirer = require('inquirer');
require('dotenv').config();
require('console.table');

// initate the connection to the database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    port: 3306,
    database: 'bamazon'
})

// When the connection is on show the products
connection.connect((err)=> {
    if (err) throw err;
    console.log(`connection ID: ${connection.threadId}`);
    console.log('Greeting, here is the list of our products')
    showProduct();
    connection.end();
})

function showProduct(){
    connection.query('SELECT itemID, productName, price from ??', ['products'], (err, data)=>{
        if (err) throw err;
        console.table(data)
    })
}