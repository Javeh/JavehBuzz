//https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 80;

const app = express();

const bodyParser = require("body-parser");
const { application } = require("express");
const { exit, off } = require("process");
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");
var cookieSession = require("cookie-session");
const { clear } = require("console");
const { REPL_MODE_SLOPPY } = require("repl");

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(bodyParser.json());

var expressWs = require('express-ws')(app);




const JEOPARDY_TIME = 5000;
const JEOPARDY_LOCKOUT_TIME = 2000;
const BTC_TIME = 500;

const Modes = {
  Jeopardy: "jeopardy",
  BTC: "btc"
}


class Room{
  /**
   * 
   * @param {Modes} mode A mode enum 
   */
  constructor(mode){
    this.mode = mode;
    switch(mode){
      case Modes.Jeopardy:
        this.lockout = JEOPARDY_LOCKOUT_TIME;
        this.time = JEOPARDY_TIME;
        break;
      case Modes.BTC:
        this.lockout = BTC_TIME;
        this.time = BTC_TIME;
        break;
      default:
        exit();
        break;
    }
    
    this.locked = false;
    this.buzzed = "";
    this.players = [];
  }

}

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});




app.use(
  cookieSession({
    name: "session",
    keys: ["Javeh", "Buzz"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.post("/api/register", (req, res) => {
  console.log("registration!");
  console.log("|"+ req.body["name"].trim() + "|" + req.body['room']);

  room = req.body["room"];
  if (rooms[room] == null) {
    res.sendStatus(200);
    createRoom(req.body["room"].trim());
  } else {
    res.sendStatus(200);
    addPlayer(room, req.body["name"].trim());
  }
});

//get an update about a specific room
app.get("/api/rooms/:id", (req, res) => {
  var room = req.params.id;

  if (rooms[room] == null) {
    res.sendStatus(400);
  } else {
    res.json({
      room: room,
      locked: rooms[room]["locked"],
      buzzed: rooms[room]["buzzed"],
    });
  }
});

app.post("/api/buzz", (req, res) => {
  const room = req.body["room"];
  const name = req.body["name"];
  console.log("/api/buzz: " + JSON.stringify(req.body));
  
  var buzzed = false;

  if (rooms[room] == null) {
    res.sendStatus(400);
    return;
  }
  
  var time;

  if(!rooms[room].locked){
    buzzed = true;
    rooms[room].locked = true;
    rooms[room].buzzed = name;
    time = rooms[room].time;
    
    setTimeout(() => {
      clearBuzzers(room);
    }, time);
  }
  else{
    time = rooms[room].lockout;
  }


  var response = res.json({
    
    success: buzzed,
    time: time

  });

  // the player who buzzed will keep thinking they buzzed until buzzers unlock
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



let rooms = {};

function getRoom(room) {
  if (!rooms[room]) {
    createRoom(room);
  }
  return rooms[room];
}

function clearBuzzers(room) {
  console.log("clearing room " + room);

  if (!rooms[room]) {
    createRoom(room);
  }
  rooms[room].locked = false;
  rooms[room].buzzed = "";
}
function deleteRoom(room) {
  rooms.delete(room);
}

function addPlayer(room, player) {
  rooms[room]["players"].push(player);
}

function createRoom(room) {
  console.log("creating room " + room);
  rooms[room] = new Room(Modes.BTC);
}

function changeMode(room) {
  var tempPlayers = rooms[room].players;

  if(rooms[room].mode == Modes.Jeopardy){
    rooms[room] = new Room(Modes.BTC);
  }
  else{
    rooms[room] = new Room(Modes.Jeopardy);
  }

  rooms[room].players = tempPlayers;
}

function printRooms() {
  console.log(rooms);
}

function help() {
  console.log(commands);
}

//default commands
createRoom("0");

// command : {args} info
commands = [clearBuzzers, createRoom, printRooms, changeMode, deleteRoom];

//TODO make a proper command system

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", function (text) {
  try {
    var rst = eval(text);
    if (rst) {
      console.log(rst);
    }
  } catch (e) {
    console.log(e);
  }

  process.stdout._write("> ");

});

//default commands
createRoom("0");

/*
setTimeout(() => {
  process.stdout._write("> ");
}, 250);
*/
