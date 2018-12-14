require('console.table');
var inquirer = require('inquirer');
var conncection = require('./mysql');

conncection.connect((err) => {
    if (err) throw err;
    showTask();
})

// starting function
function showTask() {
    inquirer.prompt([{
        type: 'list',
        message: 'Greeting Mrs/Mr manager! here is the list a set of menu options:\n',
        name: 'task',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
            'Exit']
    }]).then((res) => {
        switch (res.task) {
            case 'View Products for Sale':
                return viewProducts();
            case 'View Low Inventory':
                return lowInventory();
            case 'Add to Inventory':
                return addToInventory();
            case 'Add New Product':
                return AddProduct();
            default:
                console.log('Have a greate day!\n');
                conncection.end()
        }
    })
}

// this function will enable recursion
function askAgain() {
    inquirer.prompt([{
        message: 'Would you like to continue?',
        name: 'startOver',
        type: 'confirm',
        default: 'Yes'
    }]).then((res) => {
        res.startOver ? showTask() : conncection.end();
    })
}

// list every available item
function viewProducts() {
    conncection.query('SELECT itemID, productName, price, stockQuantity FROM ??', ['products'], (err, data) => {
        if (err) throw err;
        console.table(data);
        askAgain();
    })
}

// list all items with an inventory count lower than five.
function lowInventory() {
    conncection.query('SELECT productName , stockQuantity FROM ?? WHERE stockQuantity < 5', ['products'], (err, data) => {
        if (err) throw err;
        if (data.length > 0) {
            console.table(data)
        } else {
            console.log('No low inventory item has found!')
        }
        askAgain();
    })
}

// let the manager add more of any item currently in the store.
function addToInventory() {
    console.log('addToInventory');
    askAgain();
}

// allow the manager to add a completely new product to the store.
function AddProduct() {
    console.log('AddProduct');
    askAgain();
}