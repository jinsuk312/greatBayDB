// DEPENDENCIES
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database(I use MAMP, because its free)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // user name
    user: "root",
    // password
    password: "root",
    database: "greatBay_DB"
});
// connect to the mysql server and sql database
connection.connect(function(err){
    if(err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
})
// function which prompts the user for what action they should take
function start() {
    // prompt user auction option of POST or BID
    inquirer
    .prompt({
        name: "postOrBid",
        type: "rawlist",
        message: "Would you like to [POST] an auction or [BID} on an auction?",
        choices: ["POST", "BID"]
    })
    // after the question, take the answer and if its equal to "POST" thenrun postAuction...
    .then(function(answer) {
        if(answer.postOrBid.toUpperCase() === "POST"){
            postAuction();
        // otherwise run bidAuction if the answer is "BID"
        }else{
            bidAuction();
        }
    });
}
// function to handle posting new items up for auction
function postAuction() {
    // prompt for info about the item being put up for auction
    inquirer
    .prompt([
        {
            name: "item",
            type: "input",
            message: "What is the item you would like to submit?"
        },
        {
            name: "category",
            type: "input",
            message: "What category would you like to place your auction in?"
        },
        {
            name: "startingBid",
            type: "input",
            message: "What would you like your starting bid to be?",
            validate: function(value) {
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ])
    // query the database to insert a new item into the db with that info
    .then(function(answer){
        connection.query(
            "INSERT INTO auctions SET ?",
            {
                item_name: answer.item,
                category: answer.category,
                starting_bid: answer.startingBid,
                highest_bid: answer.startingBid
            },
            function(err){
                if(err) throw err;
                console.log("Your auction was created succesfully!");
                //re-prompt user if they want to bid or post
                start();
            }
        );
    });
}
// function to handle BID option
function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}