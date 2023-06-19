exports.getHome = (req,res,next) => {
    res.render('index',{
    isUser : req.session.userId,
    friendRequests : req.friendRequests
})
}
