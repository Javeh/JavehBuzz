//https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 80;

const app = express();

const bodyParser = require("body-parser");
const { application } = require("express");
const { exit } = require("process");
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");
var cookieSession = require("cookie-session");
const { clear } = require("console");
const { REPL_MODE_SLOPPY } = require("repl");

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(bodyParser.json());

const JEOPARDY_TIME = 5000;
const BTC_TIME = 500;

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
  console.log(req.body);

  room = req.body["room"];
  if (rooms[room] == null) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    addPlayer(room, req.body["name"]);
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
  console.log(req.body);
  var buzzed = false;

  if (rooms[room] == null) {
    res.sendStatus(400);
    return;
  }

  if (rooms[room]["locked"] == false) {
    console.log(name + " buzzed!");
    rooms[room]["locked"] = true;
    buzzed = true;
    rooms[room]["buzzed"] = name;
    if (rooms[room]["mode"] == "btc") {
      setTimeout(() => {
        clearBuzzers(room);
      }, BTC_TIME);
    } else if (rooms[room]["mode"] == "jeopardy") {
      {
        setTimeout(() => {
          clearBuzzers(room);
        }, JEOPARDY_TIME);
      }
    }
  }

  res.json({
    buzzed: buzzed,
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
  rooms[room]["locked"] = false;
  rooms[room]["buzzed"] = "";
}
function deleteRoom(room) {
  rooms.delete(room);
}

function addPlayer(room, player) {
  rooms[room]["players"].push(player);
}

function createRoom(room) {
  console.log("creating room " + room);
  rooms[room] = {
    locked: false,
    mode: "btc", //jeopardy, btc
    players: [],
    buzzed: "",
  };
}

function changeMode(room) {
  if (rooms[room]["mode"] === "btc") {
    rooms[room]["mode"] = "jeopardy";
  } else {
    rooms[room]["mode"] = "btc";
  }
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

setTimeout(() => {
  process.stdout._write("> ");
}, 250);
