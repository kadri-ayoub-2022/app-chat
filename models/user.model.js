const mongoose = require('mongoose');

const Chat = require('./chat.model').Chat;

const db_url = 'mongodb://127.0.0.1:27017/chat-app'

const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    image : {type: String, default: 'default-user-image.jpeg'},
    friends : {
        type : [{name: String,image: String,id: String,chatId: String}],
        default:[]
    },
    friendRequests: {
        type: [{name: String, id: String}],
        default:[]
    },
    sentRequests : {
        type: [{name: String, id: String}],
        default:[]
    }
});

exports.getUserData = id => {
    return new Promise((resolve,reject) => {
        mongoose.connect(db_url).then(() => {
            return User.findById(id);
        }).then((data) => {
            mongoose.disconnect();
            resolve(data)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
};

exports.sendFriendRequest = async (data) => {
    try {
        await mongoose.connect(db_url)
        await User.updateOne({ _id : data.friendId },{ $push : { friendRequests: {name: data.myName , id: data.myId } } });
        await User.updateOne({ _id : data.myId },{ $push : { sentRequests: {name: data.friendName , id:data.friendId } } });
        mongoose.disconnect()
    } catch(err){
        mongoose.disconnect()
        throw new Error(err)
    }
}

exports.cancelFriendRequest = async data => {
    try {
        await mongoose.connect(db_url)
        await User.updateOne({ _id : data.friendId },{ $pull : { friendRequests: { id:data.myId } } });
        await User.updateOne({ _id : data.myId },{ $pull : { sentRequests: { id:data.friendId } } });
        mongoose.disconnect()
    } catch(err){
        mongoose.disconnect()
        throw new Error(err)
    }
}

exports.acceptFriendRequest = async data => {
    try {
        await mongoose.connect(db_url)
        let newChat = new Chat({
            users: [data.myId,data.friendId]
        })
        let chatDoc = await newChat.save();
        await User.updateOne({ _id : data.myId },{$push : { friends : {name : data.friendName,image:data.friendImage,id:data.friendId,chatId: chatDoc._id}}});
        await User.updateOne({_id : data.myId},{$pull : {friendRequests : {id: data.friendId}}});
        await User.updateOne({_id : data.friendId},{$push :{ friends : {name : data.myName,image:data.myImage,id:data.myId,chatId: chatDoc._id}}});
        await User.updateOne({_id : data.friendId},{$pull :{ sentRequests: { id:data.myId } }});
        mongoose.disconnect()
    } catch (err) {
        mongoose.disconnect()
        throw new Error(err)
    }
}

exports.rejectFriendRequest = async data => {
    try {
        await mongoose.connect(db_url)
        await User.updateOne({_id : data.myId},{$pull : {friendRequests : {id: data.friendId}}});
        await User.updateOne({_id : data.friendId},{$pull :{ sentRequests: { id:data.myId } }});
        mongoose.disconnect()
    } catch (err) {
        mongoose.disconnect()
        throw new Error(err)
    }
}

exports.deleteFriend = async data => {
    try {
        await mongoose.connect(db_url);
        await User.updateOne({_id : data.myId},{$pull : {friends : {id: data.friendId}}});
        await User.updateOne({_id : data.friendId},{$pull : {friends : {id: data.myId}}});
        mongoose.disconnect()
    } catch (err) {
        mongoose.disconnect()
        throw new Error(err)
    }
}


exports.getFriendRequests = async id =>  {
    try {
        await mongoose.connect(db_url);
        let data = await User.findById(id);
        mongoose.disconnect();
        return data.friendRequests;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err)
    }
}

exports.getFriends = async id => {
    try {
        await mongoose.connect(db_url);
        let data = await User.findById(id);
        mongoose.disconnect();
        return data.friends;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
}
const User = mongoose.model('user', userSchema);
exports.User = User
