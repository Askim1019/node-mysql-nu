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