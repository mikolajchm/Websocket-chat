const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const io = socket(server);
const messages = [];
let users = [];

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        users = users.filter(user => user.id !== socket.id);
        console.log('Updated users list:', users);
        socket.broadcast.emit('userLeft', socket.userName);
    });
    socket.on('join', (login) => {
        console.log('User joined:', login);
        users.push({ name: login, id: socket.id });
        console.log('Updated users list:', users);
        socket.broadcast.emit('newUser', login);
        socket.userName = login;
    });
    console.log('I\'ve added a listener on message event \n');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client', 'index.html'));
});

