const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');
const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
    socket.on('join', (name) => {
        usersService.addUser({
            id: socket.id,
            name
        });
        io.emit('update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        usersService.removeUser(socket.id);
        socket.broadcast.emit('update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on('connection', (socket) => {
    socket.on('typing', (typing) => {
        usersService.addTyping(typing.from);
        socket.broadcast.emit('typing', {
            from: 'chat',
            usersTyping: usersService.getAllTyping(),
            typing: true
        })
    });
});

io.on('connection', (socket) => {
    socket.on('saysHello', (name) => {
        socket.broadcast.emit('saysHello', {
            text: `${name} joined ChatApp`,
            from: 'chat'
        })
    });
});

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        const user = usersService.getUserById(socket.id);
        usersService.removeTyping(message.from);
        if (user) {
            const {name} = user;
            socket.broadcast.emit('message', {
                text: message.text,
                from: name
            });
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});