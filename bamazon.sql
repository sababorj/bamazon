CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

-- product table
CREATE TABLE products (
itemID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
productName VARCHAR(255) NOT NULL,
department_name VARCHAR(255),
price DECIMAL (10,2),
stockQuantity INT
);

-- creating 11 product
INSERT INTO products (productName, department_name, price, stockQuantity)
Values ('jacket', 'Men Cloth', 99.99, 1000),
('Shoes', 'Men Cloth', 30.43, 250),
('TV-Sony', 'Electronics', 250.90, 1000),
('Apple Watch', 'Electronics', 450.90, 200),
('Apple Lap Top', 'Electronics', 2999.90, 400),
('China','Kitchen Equipment', 50.50, 96),
('Pot Set','Kitchen Equipment', 200.50, 76),
('Curtain','Home Equipment', 200.50, 76),
('Curpet','Home Equipment', 340.80, 80),
('Shoes', 'Women Cloth',109.98, 100),
('Dress', 'Women Cloth',900.98, 10);

-- make sure we have only the data we have inserted 
SELECT COUNT(*) FROM products;