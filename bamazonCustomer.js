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

// Wglobal variable to keep the total balance of the customer 
var balance = 0;
// When the connection is on show the products
connection.connect((err) => {
    var balance = 0;
    if (err) throw err;
    console.log(`connection ID: ${connection.threadId}`);
    console.log('Greeting, here is the list of our products')
    showProduct();
})

// this function starts shoping by showing items
function showProduct() {
    connection.query('SELECT itemID, productName, price from ??', ['products'], (err, data) => {
        if (err) throw err;
        console.table(data)
        placeOrder();
    })
}

// this function is how to plece order (more than once order)
function placeOrder() {
    inquirer.prompt([{
        message: 'What item would you like to purchase?',
        name: 'item'
    },
    {
        message: 'How many?',
        name: 'quantity',
        validate: quantity => parseInt(quantity)
    }]).then((res) => {
        connection.query('SELECT stockQuantity FROM products WHERE productName = ?', [res.item.trim()], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                purchase(data[0].stockQuantity)
                } else {
                    // else happends if user type an item which is not in DB
                    console.log('The item is not among our products')
                    askAgain()
                }    
        })
        function purchase(stockQuantity) {
            if(stockQuantity < res.quantity){
                console.log('Sorry, Insufficient quantity!');
                askAgain();
            } else {
            var newQuantity = stockQuantity - res.quantity;
            connection.query('SELECT price from ??', ['products'],(err, data) => {
                if (err) throw err;
                balance += (data[0].price * res.quantity);
                console.log(balance)
                connection.query(`UPDATE products SET stockQuantity = ? WHERE productName = ?;`, [newQuantity,res.item.trim()], (err, data) => {
                    if (err) throw err;
                    askAgain();

            }) 
            })
        }
        }
    })
    {
        // this function takes care of placing more than one item order
        function askAgain() {
            inquirer.prompt([{
                message: 'Would you like to continue shopping?',
                type: 'confirm',
                default: 'Yes',
                name: 'chooseAgain'
            }]).then((res) => {
                if (res.chooseAgain) {
                    placeOrder()
                } else {
                    console.log(`your total balence is ${balance}, goodbye!`);
                    connection.end();
                }
            })
        }
    }
}