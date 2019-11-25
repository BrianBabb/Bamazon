var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "$kyl1ne22",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});


//show inventory first after the connection is made
function start() {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);

    inquirer.prompt([
      {
        name: "choice",
        type: "input",
        message: "What is the item_id of the product you would like?"
      },
      {
        name: "choice",
        type: "input",
        message: "How many of item_id would you like?"
      }
    ]) 
    
  });
  

}