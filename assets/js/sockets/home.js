//const myid = document.getElementById("myId")
socket.emit("getOnlineFriends",myid);

socket.on("onlineFriends", onlineFriends => {
    let div = document.getElementById('onlineFriends')
    if(onlineFriends.length ===0) { 
        div.innerHTML = `
            <p class="alert alert-danger"> No Online Friends </p>
        `
    } else {
        let html =`
            <div class="row">
        `
        for (let friend of onlineFriends) {
            html += ` 
                <div class="col col-12 col-md-6 col-lg-4">
                    <img src="/${friend.image}">
                    <div>
                        <h3>
                            <a href="/profile/${friend.id}">${friend.name}</a>
                        </h3>
                        <a href="/chat/${friend.chatId}" class="btn btn-success"> Chat</a>
                    </div>
                </div>
            `
        }
        html += `</div>`
        div.innerHTML = html
    }
})