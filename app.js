//jshint esversion:6

// require statements for each necessary node package
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// initialize the app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set the view engine and licate the views folder
app.set('view engine', 'ejs');
app.set('views', (__dirname + '/views'));

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

// connect using the uri. Private key
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

// Chat message schema
const chatMessageSchema = {
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}

const ChatMessage = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);



app.get("/", function(req, res) {
  res.render("homePage");
});

app.get("/execs", function(req, res) {
  res.render("exec");
});

app.get("/QCC2024", function(req, res) {
  res.render("QCC2024");
});

app.get("/coaching", function(req, res) {
  res.render("coaching");
});

app.get("/homePage", function(req, res) {
  res.redirect("/");
});

app.get("/CUCC2025", function(req, res) {
  res.render("CUCC2025");
});

app.get("/blitzT", function(req, res) {
  res.render("blitzT");
});

app.get("/eventsPage", function(req, res) {
  res.render("eventsPage");
});

app.get("/CUCC2024", function(req, res) {

  // THIS is the syntax to find items in a 
  // collection. Must use .exec() in order
  // to apply a then catch structure.
  School.find({}).exec()
    .then(function(results) {
      // render the homestrap ejs page, passing in the
      // results of the database query
      res.render("CUCC2024", {schools: results});
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/base", function(req, res) {
  res.render("jaesonHome");
});

app.get("/signup", function(req, res){
  res.render("signupStrap");
});

app.get("/eventsPageTemplate", function(req, res){
  res.render("eventsPageTemplate");
});

app.get("/QCC2025", function(req, res){
  res.render("QCC2025");
});

app.get("/RapidOpen2025", function(req, res){
  res.render("RapidOpen2025");
});

app.get("/CUCCQualifiers2025", function(req, res){
  res.render("CUCCQualifiers2025");
});

app.get("/CUCC2026", function(req, res){
  res.render("CUCC2026");
});


app.post("/signup", function(req,res) {
  // console.log(req.body.teamName);

  // create a new instance of Player based on results of the form
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

  // console.log(req.body.captain);

  // create an instance of School using info from form
  const school = new School({
    name: req.body.teamName,
    section: req.body.section,
    players: playersList,
    approved: 0,
    captain: req.body.captain,
  });

  // the slightest of input checking hahahaha
  if (school.name != "") {
    school.save();
  }

  // redirect to home
  res.redirect("/cucc");

});

// Allow robots.txt file to be accessed by googlebot
// necessary for hosting online
app.get("/robots.txt", function(req, res){
  res.sendFile(__dirname + "/robots.txt");
});

// Admin route to clear all chat messages
app.get("/clearChat", function(req, res){
  ChatMessage.deleteMany({})
    .then(function(result) {
      console.log("Cleared " + result.deletedCount + " chat messages");
      res.send("Successfully cleared " + result.deletedCount + " chat messages");
    })
    .catch(function(err) {
      console.log("Error clearing messages: " + err);
      res.status(500).send("Error clearing messages: " + err);
    });
});

// Socket.io connection handling
io.on("connection", function(socket) {
  console.log("User connected: " + socket.id);

  // Load and send message history when user connects
  ChatMessage.find({})
    .sort({ timestamp: 1 }) // Sort ascending (oldest first) so no need to reverse
    .exec()
    .then(function(messages) {
      socket.emit("messageHistory", messages);
    })
    .catch(function(err) {
      console.log("Error loading message history: " + err);
    });

  // Handle new chat messages
  socket.on("chatMessage", function(data) {
    // Basic validation
    if (!data.username || !data.message) {
      socket.emit("error", "Username and message are required");
      return;
    }

    // Trim and validate message length
    const trimmedMessage = data.message.trim();
    const trimmedUsername = data.username.trim();

    if (trimmedMessage.length === 0) {
      socket.emit("error", "Message cannot be empty");
      return;
    }

    if (trimmedMessage.length > 500) {
      socket.emit("error", "Message is too long (max 500 characters)");
      return;
    }

    if (trimmedUsername.length > 30) {
      socket.emit("error", "Username is too long (max 30 characters)");
      return;
    }

    // Create and save message
    const chatMessage = new ChatMessage({
      username: trimmedUsername,
      message: trimmedMessage,
      timestamp: new Date()
    });

    chatMessage.save()
      .then(function() {
        // Broadcast message to all connected clients
        io.emit("newMessage", {
          username: trimmedUsername,
          message: trimmedMessage,
          timestamp: chatMessage.timestamp
        });
      })
      .catch(function(err) {
        console.log("Error saving message: " + err);
        socket.emit("error", "Failed to send message");
      });
  });

  // Handle disconnection
  socket.on("disconnect", function() {
    console.log("User disconnected: " + socket.id);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(port, function() {
  console.log("Server has started successfully on port " + port);
});
