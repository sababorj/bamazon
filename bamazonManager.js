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
    conncection.query('SELECT itemID, productName , stockQuantity FROM ?? WHERE stockQuantity < 5', ['products'], (err, data) => {
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
    inquirer.prompt([{
        message: "Please provide the product name you would like to add to the invetory:",
        name: 'item',
    }, {
        message: "How many of this item would you like to add?",
        name: "quantity",
        validate: input => !!parseInt(input)
    }]).then((res) => {
        conncection.query('SELECT stockQuantity FROM products WHERE productName = ?', [res.item.trim()], (err, data) => {
            if (err) throw err
            if (data.length > 0) {
                var newQuantity = parseInt(res.quantity) + data[0].stockQuantity;
                var updatedItem = res.item.trim();
                conncection.query('UPDATE products SET stockQuantity = ? WHERE productName = ?;', [newQuantity, updatedItem], (err, data) => {
                    if (err) throw err;
                    if (data.changedRows > 0) { console.log(`Item ${updatedItem}'s quantity is now ${newQuantity}`) }
                    askAgain();
                })
            } else {
                console.log('This item is not among our products');
                askAgain();
            }
        })
    })
}

// allow the manager to add a completely new product to the store.
function AddProduct() {
    console.log('Please provide the product information:')
    inquirer.prompt([{
        message: "Product Name?",
        name: 'item'
    }, {
        message: "Product category or department?",
        name: 'department'
    }, {
        message: "Product price?",
        name: 'price',
        validate: input => !!parseFloat(input) && (parseFloat(input) + '').length === input.length
    }, {
        message: "Product quantity?",
        name: 'quantity',
        validate: input => !!parseInt(input)
    }]).then((res) => {
        var name = res.item;
        var depart = res.department;
        var price = parseFloat(res.price);
        var quantity = parseInt(res.quantity);
        conncection.query('SELECT * FROM ?? WHERE productName = ?', ['products', name], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // if this item is already in the system update that one
                conncection.query('UPDATE ?? SET stockQuantity = ? , price = ?,  department_name =  ?  Where productName = ?;;', ['products', quantity, price,depart,name], (err, data) => {
                    if (err) throw err;
                    if (data.changedRows > 0) { console.log(`Item ${name} was already in the system! it is now updated `) }
                    askAgain();
                })
            } else {
                // create new item
                conncection.query('INSERT INTO ?? (productName, department_name, price, stockQuantity) VALUES (?, ?, ?, ?);', ['products', name, depart, price, quantity], (err, data) => {
                    if (err) throw err;
                    if (data) { console.log(`${name} is now in the inventory`) }
                    askAgain();
                })
            }
        })
    })
}