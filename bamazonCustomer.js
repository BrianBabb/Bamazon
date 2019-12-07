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

var cost = 0;
var quantity = 0;
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
    ]).then(function (stock) {
      connection.query("SELECT * FROM products WHERE ?",
        { item_id: stock.choice }, function (err, res) {
          if (err) throw err;

          if (stock.quantity > res[0].stock_quantity) {
            inquirer.prompt([
              {
                name: "continue",
                type: "input",
                message: "Sorry, out of stock of that item",

              }

            ]).then(function (stock) {
              if (stock.continue == 'yes') {
                start()

              } else if (cost >= 0) {
                console.log("total amount due is", parseFloat(Math.round(cost * 100) / 100).toFixed(2));
                connection.end();
              } else {
                console.log("Thank you, Come again!");
              }

            });
          } else {
            console.log("fully stocked");
            totalCost = cost + res[0].price * stock.quantity;
            var quantity = res[0].stock_quantity - stock.quantity;
            connection.query(`UPDATE products SET stock_quantity=${quantity} WHERE item_id = ${stock.choice}`, function (res) {
              inquirer
                .prompt([

                  {
                    type: "input",
                    message: "Place another order? ",
                    name: "continue"
                  }
                ]).then(function (stock) {
                  if (stock.continue == "yes") {
                    start()
                  } else {
                    console.log("your, total is  $", totalCost);
                    connection.end();
                  }

                })
            })

          };

        })

    })

  });


}