const mongoose = require('mongoose');

const db_url = 'mongodb://127.0.0.1:27017/chat-app';
const chatSchema = mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref:'user'/*model */}]
});

exports.getchat = async (chatid) => {
    try{
        await mongoose.connect(db_url);
        const chat  = await Chat.findById(chatid).populate('users');
        mongoose.disconnect();
        return chat
    }catch (err) {
        mongoose.disconnect();
        throw new Error(err)
    }
}

const Chat = mongoose.model("chat", chatSchema);
exports.Chat = Chat;