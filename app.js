//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

console.log(process.env.URI);
const uri = process.env.URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

mongoose.connect(uri);

// schema for a single player on a team
const playerSchema = {
  name: String,
  rating: Number,
  cfcID: Number
}

// a schema for a given school that is signed up for the tournament
// each team will be connected with a list of players
const schoolSchema = {
  name: String,
  players: [playerSchema],
  section: Number,
  approved: Boolean
}

// Item is an object hence capital I.
// call mongoose method model with singular 
// name and schema to create a new model.
// This is all pretty standard OOP but
// with permanence thanks to 'goose
// const Item = mongoose.model(
//   "Item",
//   itemsSchema
// );

const Player = mongoose.model(
  "Player",
  playerSchema
);

const School = mongoose.model(
  "School",
  schoolSchema
);

// const player1 = new Player ({
//   name: "Jack Fergusson",
//   rating: 1700,
//   cfcID: 1345
// });

// const player2 = new Player ({
//   name: "Jordan Capello",
//   rating: 200,
//   cfcID: 3084
// });

// const player3 = new Player ({
//   name: "Dennis Tran",
//   rating: 1900,
//   cfcID: 3490
// });

// const player4 = new Player ({
//   name: "Elkan Fok",
//   rating: 2800,
//   cfcID: 5932
// });

// const playerList = [player1, player2, player3, player4];

// const schoolTest = new School({
//   name: "Queen's University",
//   section: 0,
//   players: playerList,
//   approved: 1,
// });

// once all the items are created and grouped into
// an array, they must all be inserted into db
// MUST USE EXACTLY THIS SYNTAX!!!!!!
// THEN CATCH.
// you can now use the mongo shell (mongosh) to
// see the added items.
// (Maybe?) wrapping insertMany in an async function so that
// I can await the insertion before moving on.
// The anonymous function is immediately called.
// (async function() {
//   await Item.insertMany(defaultItems)
//     .then(function() {
//       console.log("Success!");
//     })
//     .catch(function(err) { 
//       console.log(err);
//     });
//   })();


app.get("/", function(req, res) {

  // THIS is the syntax to find items in a 
  // collection. Must use .exec() in order
  // to apply a then catch structure.
  School.find({}).exec()
    .then(function(results) {
      if (results.length === 0) {
        schoolTest.save();
      }
      console.log(results);
      res.render("teams", {schools: results});
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.post("/apply", function(req, res){

  // const itemName = req.body.newItem;
  // // requesting the NAME of the button (list)
  // // gives you the VALUE of the button (listTitle)
  // const listName = req.body.list;

  // const item = new Item({
  //   name: itemName,
  // });

  // if (listName === "Today") {
  //   item.save();
  //   res.redirect("/");
  // } else {
  //   List.findOne({name: listName}).exec()
  //     .then(function(foundList){
  //       // can only use save() on something that
  //       // is a mongoose model.
  //       foundList.items.push(item);
  //       foundList.save();
  //       res.redirect("/" + listName);
  //     })
  //     .catch(function(err){
  //       console.log(err);
  //     });
  // }

});

app.get("/signup", function(req, res){
  res.render("signup");
});

app.post("/signup", function(req,res) {
  console.log(req.body.teamName);

  const player1 = new Player({
    name: req.body.player1Name,
    rating: Number(req.body.player1Rating),
    cfcID: Number(req.body.player1ID),
  });

  const player2 = new Player({
    name: req.body.player2Name,
    rating: Number(req.body.player2Rating),
    cfcID: Number(req.body.player2ID),
  });

  const player3 = new Player({
    name: req.body.player3Name,
    rating: Number(req.body.player3Rating),
    cfcID: Number(req.body.player3ID),
  });

  const player4 = new Player({
    name: req.body.player4Name,
    rating: Number(req.body.player4Rating),
    cfcID: Number(req.body.player4ID),
  });

  const playersList = [player1, player2, player3, player4];

  // returns 1 or 0 based on radio selection
  // console.log(req.body.teamSection);

  const school = new School({
    name: req.body.teamName,
    section: req.body.teamSection,
    players: playersList,
    approved: 0,
   });

   school.save();

   res.redirect("/");

});

app.get("/home", function(req, res) {
  res.render("home");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
