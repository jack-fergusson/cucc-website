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
  approved: Boolean,
  captain: Number,
}

const Player = mongoose.model(
  "Player",
  playerSchema
);

const School = mongoose.model(
  "School",
  schoolSchema
);


app.get("/", function(req, res) {
  res.redirect("/home");
})

app.get("/home", function(req, res) {

  // THIS is the syntax to find items in a 
  // collection. Must use .exec() in order
  // to apply a then catch structure.
  School.find({}).exec()
    .then(function(results) {
      // console.log(results);
      res.render("homeStrap", {schools: results});
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/signup", function(req, res){
  res.render("signupStrap");
});

app.post("/signup", function(req,res) {
  // console.log(req.body.teamName);

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

  if (req.body.player5Name != null) {
    const player5 = new Player({
      name: req.body.player5Name,
      rating: Number(req.body.player5Rating),
      cfcID: Number(req.body.player5ID),
    });
    var playersList = [player1, player2, player3, player4, player5];
  }
  else {
    var playersList = [player1, player2, player3, player4];
  }

  // returns 1 or 0 based on radio selection
  // console.log(req.body.section);

  // var avgRating = (player1.rating + player2.rating + player3.rating + player4.rating) / 4;

  // var teamSection = 1;

  // if (avgRating >= 1800) {
  //   var teamSection = 0;
  // }

  console.log(req.body.captain);

  const school = new School({
    name: req.body.teamName,
    section: req.body.section,
    players: playersList,
    approved: 0,
    captain: req.body.captain,
  });

  if (school.name != "") {
    school.save();
  }

  res.redirect("/");

});

// Allow robots.txt file to be accessed by googlebot
app.get("/robots.txt", function(req, res){
  res.sendFile(__dirname + "/robots.txt");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
