const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')
const db = new sqlite3.Database('game.db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from a 'public' folder
app.use(express.static('public'));

// Load user data from the text file
const userDataFile = 'user_data.txt';
let userData = {};

fs.readFile(userDataFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading user data file:', err);
        return;
    }

    // Parse the user data and store it in an object
    data.split('\n').forEach(line => {
        const [username, password] = line.split(':');
        if (username && password) {
            userData[username.trim()] = password.trim();
        }
    });
});

io.on('connection', (socket) => {
    

    socket.on('login', (data) => {
        const { username, password , option , gameId} = data;
        console.log('A user connected');
        if (userData[username] === password) {
            if(option == "newGame"){
                
// Create the 'territories' table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS T${gameId} (
            id INTEGER PRIMARY KEY,
            name TEXT,
            owner TEXT,
            numberOfTroops INTEGER,
            castle INTEGER,
            port INTEGER,
            neighbors TEXT
        )
    `);
});
            socket.emit('verification_result', { success: true });
            // Serve the riskGame.html page to the authenticated user
        
        }
        } else {
            socket.emit('verification_result', { success: false });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/lobby.html');
});
app.get('/riskGame', (req, res) => {

    res.sendFile(__dirname + '/public/riskGame.html');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
