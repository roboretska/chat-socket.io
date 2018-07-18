const express = require('express');
const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);

const messages = [];
const usernames = [];
const MAX_AMOUNT = 100;


app.use(express.static("../client/view"));

io.on('connection', (socket) => {
    let user={};
    console.log('Connection is opened');
    // socket.emit('new user id', socket.id);
    socket.on('new user', (nicknames) => {
        user=nicknames;
        usernames.push(nicknames);
        console.log(usernames);
        usernames.forEach(item =>{
            if(item.nickname===nicknames.nickname){
                item.connectionStatus='just connected';
                setTimeout(function(){
                    item.connectionStatus='connected';
                    io.emit('new users', usernames);
                }, 60000);
            }
        });
        io.emit('new users', usernames);
        console.log(usernames);

        // io.emit('user connected', 'just added')
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
        io.emit('is typing', `@${user} is typing...`)
    });

    socket.on('disconnect', () => {
        usernames.forEach(item =>{
            if(item.nickname===user.nickname){
                item.connectionStatus='just disconnected';
                setTimeout(function(){
                    item.connectionStatus='disconnected';
                    io.emit('new users', usernames);
                }, 60000);
            }
        });
        io.emit('new users', usernames);

        // console.log(user);
        console.log("Disconected");
    });
});
http.listen(8080, () => {
    console.log('Server is working now on port 8080');
});

