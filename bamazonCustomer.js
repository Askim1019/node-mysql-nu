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

const connection = mysql.createConnection(config);

let sqlCommand = 'SELECT * FROM products';

connection.connect(function(err){
    if (err) {
        console.error('connection.js: ', err);
    }

    console.log('connected to mysql! ' + config.database, connection.threadId);

    connection.query(sqlCommand, function(err, response) {
        if (err) { console.lerror('connection.js: ', err);}

        console.log('response: ', response);
    })

    connection.end();
});