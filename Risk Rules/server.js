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

// Get allowed move from cetain tile


function allowedMoves(user,name,gameid){
    db.all(`SELECT FROM ${gameid}`)
    //takes a username and name of tile gives all options for available moves as astring with , as seperator
}





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

        
            socket.emit('runRisk',);
            // Serve the riskGame.html page to the authenticated user
        
        }
        } else {
            socket.emit('verification_result', { success: false });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on("get_menu_data",(data)=>{
        const [name,tile,gameid] = data;
        
        socket.emit("moves",allowedMoves(name,tile,gameid))


    });

    socket.on('Move_played', (data) => {
        cosnt [target,from,gameID] = data;
        console.log('Received data from floating menu:', data);

        // data bas option value which is the name of the tile to be attacked and the name of the tile attacking from
        // Attack function goes here
        socket.emit('end_turn');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/lobby.html');
});
app.get('/riskGame/:user/:gameid', (req, res) => {
    const filename = req.params.gameid;
    const uner = req.params.user;
    const originalFilePath = path.join(__dirname + '/public/riskGame.html');

    // Read the original HTML file
    fs.readFile(originalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }

        // Append content to the original HTML
        const appendedContent = `<p id = "gameid" style="display: none;">${filename}</p><p id = "userid" style="display: none;">${user}</p>`;
        const modifiedHTML = data + appendedContent;

        // Create a temporary file with the modified content
        const tempFilename = `temp_${filename}`;
        const tempFilePath = path.join(__dirname, 'files', tempFilename);

        fs.writeFile(tempFilePath, modifiedHTML, 'utf8', (err) => {
            if (err) {
                console.error('Error creating temporary file:', err);
                res.status(500).send('Error creating temporary file');
                return;
            }

            // Send the temporary modified file to the client
            res.sendFile(tempFilePath, {}, (err) => {
                if (err) {
                    console.error('Error sending file to client:', err);
                    res.status(500).send('Error sending file to client');
                }

                // Delete the temporary file after sending
                fs.unlink(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            });
        });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
