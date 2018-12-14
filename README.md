# Bamazon
#### Bamazon in an Amazon-like storefront. The app will take in orders from customers and deplete stock from the store's inventory.
Before running the application bamazon.sql needs to be run in your database to create the store's database.
Bamazan then provides two main application:
1. bamazonCustomer 
2. bamazonManagers:

###### ``` node bamazonCustomer.js ``` :
Application will first display all of the items available for sale. Then prompt users to place the order by providing product name and the quantity. 
If there is enough product in the store user is able to buy and their balance will be calculated accordingly. After placing an order customer will be prompt to chose either leaving or placing another order.

![Customer](/images/Customer.png)

###### ``` node bamazonMAnager.js ``` :
Bamazon will then provide you with the following command options : 
* View Products for Sale ----->> provides the list of inventory
*  View Low Inventory ----->> provides the list of items in inventory which have less than 5 quantity.
*  Add to Inventory ----->> enables the manager to add quantity to products by providing product name and the quantity number.
*  Add New Product ----->> enables the manager to add a new item to the inventory (if item is already listed that item will be updated to avoid repetation in the store's database).
*  Exit ----->> enables the manager to leave.

After accomplishing one task manager will be prompt to chose either leaving or doing another task.

![Manager](/images/Manager.png)
