require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const keys = require('./keys.js');

const config = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: keys.mysqlkey.secret,
    database: 'bamazon'
}

// This establishes the connection and does the querying for us. Connection.connect only used to check connection
const connection = mysql.createConnection(config);

// connect to the database and call the first initial function to initialize program.
// You can use connection.query as well
connection.connect(function(err){
    if (err) throw err;
    selectProduct();
});

// function for the user to get prompted on selecting the product from a list
function selectProduct() {
    var sqlCommand = "SELECT * FROM products WHERE product_name = ?";
    var product_data;
    var chosenProduct;
    var chosenQuantity;
    var stock_quantity;
    var totalPrice;

    inquirer
        .prompt({
            name: "product",
            type: "list",
            message: "What product would you like to purchase?",
            choices: [
                "apple",
                "macbook",
                "hoody",
                "dell",
                "basketball",
                "orange",
                "jeans",
                "baseball",
                "football",
                "asus"
            ]
        })
        .then(function(answer){
            // assign the user's input choice into a variable
            product_data = answer.product;

            // Connect to a database and run a query to get the user's choice data
            connection.query(sqlCommand, [product_data], (err, res) => {
                chosenProduct = res[0];

                console.log(`----------------------------`);
                console.log(`\nProduct chosen: ${chosenProduct.product_name}\n`);
                console.log(`----------------------------`);

                selectQuantity(chosenProduct);
            });
        });
}

// function to prompt the user for input on the quantity they desire of the product
function selectQuantity(chosenProduct) {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: `How many ${chosenProduct.product_name} do you want to purchase?(Please type a number)`
        })
        .then(function(answer){
            chosenQuantity = parseInt(answer.quantity);

            console.log(`----------------------------`);
            console.log(`\nQuantity chosen: ${chosenQuantity}\n`);
            console.log(`----------------------------`);

            if (Number.isInteger(chosenQuantity) === false) {
                console.log("\nPlease provide a valid integer\n");
                selectQuantity(chosenProduct);
            }

            checkQuantity(chosenProduct, chosenQuantity);
        });
}

function checkQuantity(chosenProduct, chosenQuantity) {

    if (chosenQuantity > chosenProduct.stock_quantity) {
        console.log(`The store does not have enough of ${chosenProduct.product_name}\n`);
        // Possibly have a function to restart the prompts or give a user a choice to restart the program
    } else {
        stock_quantity = (chosenProduct.stock_quantity - chosenQuantity);
        totalPrice = (chosenQuantity * chosenProduct.price);

        console.log(`----------------------------`);
        console.log(`Your total is: $${totalPrice}\n`);
        console.log(`----------------------------`);

        fulfillOrder(chosenProduct.product_name, stock_quantity);
        
    }
}

function fulfillOrder(product, stock_quantity) {
    console.log("fulfilling order...\n");

    sqlCommand = `UPDATE products SET stock_quantity = ? WHERE product_name = ?`;

    connection.query(sqlCommand, [stock_quantity, product.product_name], (err, res) => {
        if (err) throw err;

        console.log(res);
    });
}