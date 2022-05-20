// nodejs_server/index.js
    
var express = require('express');
const cors = require("cors");
var bodyParser = require('body-parser');
var app = express();
const Pusher = require("pusher");
const res = require('express/lib/response');

const pusher = new Pusher({
    appId: "1410559",
    key: "503c295a8c71896beade",
    secret: "d9ddf227f555349e2e66",
    cluster: "mt1",
    useTLS: true
});



// bodyParser is a type of middleware
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));

const hostname = '127.0.0.1';
const port = 3000;

// http status codes
const statusOK = 200;
const statusNotFound = 404;

// using an array to simulate a database for demonstration purposes
var mockDatabase = [
    {
        rupee: "1000",
        sender: "Ajay",
        time: "10:00"
    }
]

app.get('/', function(req, res){
    res.send('Hello World')
});

// Handle POST request
app.post('/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data
    mockDatabase.push(newObject);
    // send created item back with id included
    var id = mockDatabase.length - 1;
    pusher.trigger("private-my_channel", "my-event", {

        "rupee": mockDatabase[id].rupee,
        "sender": mockDatabase[id].sender,
        "time": mockDatabase[id].time
    
    });
    res.statusCode = statusOK;
    res.send(`Item added with id ${id}`);
});

app.post("/pusher/user-auth", (req, res) => {
    // const socketId = req.body.socket_id;
    // const user = {id: 12345}; // Replace this with code to retrieve the actual user id
    // const authResponse = pusher.authenticateUser(socketId, user);
    // res.send(authResponse);
    const {socket_id, channel_name} = req.body
    console.log(req.body)
    // const randomString = Math.random().toString(36).slice(2).length

    // const presenceData = {
    //     user_id: randomString,
    //     user_info :{
    //         username
    //     }
    // }

    try{
        const auth = pusher.authenticate(socket_id, channel_name);
        res.statusCode = statusOK;
        res.send(auth);
    }catch(error){
        console.log(error)
    }
    
});


app.listen(port, hostname, function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});

