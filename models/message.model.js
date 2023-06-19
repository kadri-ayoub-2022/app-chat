const mongoose = require('mongoose');

const db_url = 'mongodb://127.0.0.1:27017/chat-app';
const messageSchema = mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref:'chat'},
    content: String,
    sender: String,
    timestamp: Number
});


exports.getMessages = async (chatid) => {
    try{
        await mongoose.connect(db_url);
        const  message = await Message.find({chat: chatid},null,{
            sort: {
                timestamp : +1
            }
        }).populate({
                path: 'chat', //field
                model: 'chat', //model
                populate: {
                path: 'users', 
                model: 'user',
                select: "username image"
            }
        });
        mongoose.disconnect();
        return message
    }catch (err) {
        mongoose.disconnect();
        throw new Error(err)
    }
}

exports.newMessage = async msg => {
    try{
        await mongoose.connect(db_url)
        msg.timestamp = Date.now()
        const newMsg = await new Message(msg)// in this!!!!!
        await newMsg.save()
        mongoose.disconnect()
    }catch (err) {
        mongoose.disconnect();
        throw new Error(err)
    } 
}

const Message = mongoose.model("message", messageSchema);