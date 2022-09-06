

//https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
const express = require("express");
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

const bodyParser = require('body-parser');
const { application } = require("express");
const { exit } = require("process");
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");
var cookieSession = require('cookie-session');


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(bodyParser.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});


app.use(cookieSession({
  name: 'session',
  keys: ['Javeh', 'Buzz'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.post("/api/register", (req, res) => {
    console.log("registration!");
    console.log(req.body);
    res.sendStatus(200);

});


//get an update about a specific room
app.get("/api/rooms", (req, res) => {
    var room = req.baseUrl;

        res.json({
            room: room,
            
         
    })
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});




let rooms = {}

function getRoom(room){
    if(!rooms[room]){
        createRoom(room);
    }
    return rooms[room];
}


function clearBuzzers(room){
    console.log("clearing room " + room);

    if(!rooms[room]){
        createRoom(room);
    }
    rooms[room]['state'] = 'clear';    
}
function deleteRoom(room){
    rooms.delete(room);
}
function createRoom(room){
        console.log("creating room " + room);
        rooms[room] = {
            'state': 'clear', //locked
            'mode': 'jeopardy', //jeopardy, btc
            'players': {}
        }
}


process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
  if (text.trim().split(" ")[0] === 'clear') {
    clearBuzzers(text.trim().split(" ")[1]);
  }
  else if(text.trim().split(" ")[0] === 'create'){ 
    createRoom(text.trim().split(" ")[1]);
  }
  else if(text.trim().split(" ")[0] === 'rooms'){
    console.log(rooms);
  }
  else if(text.trim().split(" ")[0] === 'delete'){
    deleteRoom(text.trim().split(" "[1]));
  }
  else if(text.trim() === 'stop' || text.trim() === 'exit'){
    exit();
  }
  process.stdout._write("> ");

});