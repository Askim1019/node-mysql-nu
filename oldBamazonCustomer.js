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

showProducts();

connection.connect((err) =>{
    selectProduct();
});

// A function that shows the produts when first running with 'node bamazonCustomer'
function showProducts(callback) {
    let sqlCommand = "SELECT * FROM products";
    
    connection.query(sqlCommand, function(err, response){
        if (err) { console.error('connection.js: ', err);}

        console.log("PRODUCTS IN BAMAZON STOREFRONT\n");
        console.log(`----------------------------`);

        response.forEach(function(product){
            console.log(`----------------------------`);
            console.log(`${product.item_id}  ${product.product_name}  ${product.price}`);
        });

        console.log(`----------------------------`);
    });
    
    connection.end();
}

function selectProduct() {
    inquirer
        .prompt({
            name: "action",
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
            console.log(answer);
        });
}
