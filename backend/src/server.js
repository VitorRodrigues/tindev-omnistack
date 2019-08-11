const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {} //id do user : id do socket

io.on('connection', socket => {
    const { user } = socket.handshake.query; //user = user._id
    connectedUsers[user] = socket.id
})

mongoose.connect('<your mongodb connection string>', {
    useNewUrlParser: true
})

app.use((req, res, next) => {
    req.io = io //passa o IO para facilitar o uso dentro de controllers
    req.connectedUsers = connectedUsers //também para facilitar dentro das controllers
    return next()
})

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);