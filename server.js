const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

//conexcion db
mongoose.connect('mongodb://localhost/conversacion')
    .then(db => console.log('Conectado a mongo')
    .catch(err => console.log(err)));

//configuracion
app.set('port', process.env.PORT || 3000);

require('./routes/sockets')(io);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('Servidor en el puerto ' + app.get('port'));
});