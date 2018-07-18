const express = require('express');
const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

const messages = [];
const usernames = [];
const MAX_AMOUNT = 100;


app.use(express.static("../client/view"));

io.on('connection', (socket) => {
    console.log('Connection is opened');

    socket.on('new user', (nicknames) => {
        usernames.push(nicknames);
        console.log(nicknames);
        console.log(usernames);

        io.emit('new users', nicknames);
    });
    socket.emit('users list', usernames);


    socket.on('chat message', (message) => {

        if (messages.length >= MAX_AMOUNT) {
            messages.shift();
        }
        messages.push(message);
        io.emit('chat message', message)
    });
    socket.emit('chat history', messages);

    socket.on('user typing', user=>{
        console.log(user);
        io.emit('is typing', `@${user} is typing...`)
    });

    socket.on('disconnect', (reason) => {
        console.log("Disconected");
    });
});
http.listen(8080, () => {
    console.log('Server is working now on port 8080');
});

