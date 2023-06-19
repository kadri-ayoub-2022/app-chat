const newMessage = require('../models/message.model').newMessage;

module.exports = io => {
    io.on('connection', socket => {
        socket.on('joinChat',chatId => {
            socket.join(chatId)
        })
        socket.on('sendMessage', (msg,cb) => {
            io.to(msg.chat).emit('newMessage', msg);
            cb();
            newMessage(msg)
        })
    }) 
}