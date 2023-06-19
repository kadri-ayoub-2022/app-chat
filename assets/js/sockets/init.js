const socket = io();
const btn = document.getElementById('friendRequestsDropdown');


const myid = document.getElementById('myId').value;

socket.on('connect', () => { 
    socket.emit("goOnline",myid);
    socket.emit('joinNotificationsRoom',myid); 
}); 

socket.on('newFriendRequest', data => {
    const friendRequests = document.getElementById('friendRequests');
    const span = document.getElementById('span');
    if (span) {
        span.remove();
    }
    friendRequests.innerHTML +=  `
    <li> <a class="dropdown-item" href="/profile/${data.id}"> ${data.name} </a> </li>
    `;
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-success");
})

btn.onclick = () => {
    btn.classList.add("btn-primary");
    btn.classList.remove("btn-success");
}

