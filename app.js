const express = require('express');
const path = require('path');
const session = require('express-session');
const SessionStore =  require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const socketIO = require('socket.io');

const homeroute = require('./routes/home.route');
const authrouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const friendRouter = require('./routes/friend.route');
const chatRouter = require('./routes/chat.route')
const { Collection } = require('mongoose');

const getFriendRequests = require('./models/user.model').getFriendRequests;

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);
io.onlineUsers ={}

require('./sockets/friend.socket')(io);
require('./sockets/init.socket')(io);
require('./sockets/chat.socket')(io)

app.use(express.static(path.join(__dirname,'assets'))); 
app.use(express.static(path.join(__dirname,'images')));
app.use(flash());

const STORE = new SessionStore({
    uri: 'mongodb://127.0.0.1:27017/chat-app',// link de db
    collection : 'session' //name of collection
});

app.use(session({
    secret : 'write',// the text use it in the bcrypt
    saveUninitialized: false,// if i would to save the session in db after deleting
    store : STORE// the path of saving
}));


app.set('view engine', 'ejs');
app.set('views','views');

app.use((req,res,next) => {
    if(req.session.userId) {
        getFriendRequests(req.session.userId).then(requests => {
            req.friendRequests = requests;
            next();
        }).catch(err => res.redirect('/error'))
    } else {
        next()
    }
})

app.use(homeroute);
app.use('/',authrouter);
app.use('/profile',profileRouter);
app.use('/friend',friendRouter);
app.use('/chat',chatRouter);

const port =  3000;
server.listen(port, () => console.log('server listen on port 3000'));


