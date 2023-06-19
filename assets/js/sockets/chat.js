const chatId = document.getElementById('chatId').value
const msg = document.getElementById('message')
const sendBtn = document.getElementById('sendBtn')
const msgContainer = document.getElementById('messages-container')

socket.emit('joinChat',chatId)

sendBtn.onclick = (e) => {
    e.preventDefault();
    let content = msg.value;
    socket.emit('sendMessage', {
        chat: chatId,
        content: content,
        sender : myid
    }, () => {
        msg.value = ''
    })
}

socket.on('newMessage', msg => {
    msgContainer.innerHTML += `<br>`
    msgContainer.innerHTML += msg.content;
})