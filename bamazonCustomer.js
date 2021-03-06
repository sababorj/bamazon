var inquirer = require('inquirer');
require('console.table');
var connection = require('./mysql');

// global variable to keep the total balance of the customer 
var balance = 0;
// when the connection is on show the products
connection.connect((err) => {
    if (err) throw err;
    console.log('Greeting valueable customer, here is the list of our products')
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
        validate: input => !!parseInt(input)
    }]).then((res) => {
        connection.query('SELECT stockQuantity FROM products WHERE productName = ?', [res.item.trim()], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                purchase(data[0].stockQuantity)
            } else {
                // else happends if user type an item which is not in DB
                console.log('Sorry! This item is not among our products')
                askAgain()
            }
        })

        function purchase(stockQuantity) {
            if (stockQuantity < res.quantity) {
                console.log('Sorry! Insufficient quantity!');
                askAgain();
            } else {
                var newQuantity = stockQuantity - res.quantity;
                connection.query('SELECT price from products WHERE productName = ?;', [res.item.trim()], (err, data) => {
                    if (err) throw err;
                    // calculate the user balance
                    balance += (data[0].price * res.quantity);
                    console.log(`your total shopping balence is now $${balance}`);
                    // update the database
                    connection.query(`UPDATE products SET stockQuantity = ? WHERE productName = ?;`, [newQuantity, res.item.trim()], (err, data) => {
                        if (err) throw err;
                        askAgain();

                    })
                })
            }
        }
    })
    {
        // this function will enable placing multipule orders
        function askAgain() {
            inquirer.prompt([{
                message: 'Would you like to continue shopping?',
                type: 'confirm',
                default: 'Yes',
                name: 'chooseAgain'
            }]).then((res) => {
                // place another order
                if (res.chooseAgain) {
                    placeOrder()
                }
                // finishing the shopping process
                else {
                    (balance > 0) ? console.log(`We appriciate your bussiness of $${balance}, goodbye!`) : console.log(`See you next time, goodbye!`);
                    connection.end();
                }
            })
        }
    }
}