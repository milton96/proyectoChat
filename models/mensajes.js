const mongoose = require('mongoose');
const { Schema } = mongoose;

const chat = new Schema({
    nick: String,
    msg: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', chat);