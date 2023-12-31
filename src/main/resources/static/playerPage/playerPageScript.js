let playerCards_header = document.getElementById("playerCards_header")
let username_label = document.getElementById("username_label")
let onlinePlayer_list = document.getElementById('onlinePlayers_list')
let messageInput = document.getElementById('messageInput')
let chat_list = document.getElementById('chat_list')

username_label.textContent = sessionStorage.getItem('username')

let username = sessionStorage.getItem('username')
let role = sessionStorage.getItem('role')

let ready = false;

const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/blackJack'
});
stompClient.onConnect = (frame) => {
    console.log(`connected: ${frame}`)


    stompClient.subscribe('/output/onlinePlayers', onlinePlayersListObj => {

        let onlinePlayers = JSON.parse(onlinePlayersListObj.body)
        console.log("Got new connection list")

        onlinePlayer_list.innerHTML = ''

        for (let i of onlinePlayers) {
            let newUserItem = document.createElement('li')
            newUserItem.textContent = `${i.username}[${i.role}](${i.ready})`
            onlinePlayer_list.appendChild(newUserItem)
        }

    })


    stompClient.subscribe("/output/chat", newMessage => {
        let obj = JSON.parse(newMessage.body)

        let senderName = obj.sender
        let role = obj.senderRole
        let content = obj.content

        let newLi = document.createElement('li')
        newLi.textContent = `${senderName}[${role}]: ${content}`

        chat_list.appendChild(newLi)

    })

    stompClient.publish({
        destination: '/input/onlinePlayers',
        body: JSON.stringify({

                username: username,
                role: role,
                ready: false,
                action: 'CONNECTING'
            }
        )
    })
}
window.onbeforeunload = () => {
    stompClient.publish({
        destination: '/input/onlinePlayers',
        body: JSON.stringify({
            username: username,
            role: role,
            action:'DISCONNECTING'
        })
    })
    stompClient.deactivate()
}

stompClient.activate()


function sendMessage() {
    stompClient.publish({
        destination: "/input/chat",
        body: JSON.stringify({
            sender: username,
            content: messageInput.value,
            senderRole: role
        })
    })
}

function changeReadyState(){
    ready = !ready
    stompClient.publish({
        destination: "/input/onlinePlayers",
        body: JSON.stringify({
            username: username,
            role: role,
            ready:ready,
            action:"CHANGING_READY_STATE"
        })
    })
}

function startGame() {
    fetch("http://localhost:8080/blackJack/playground/start", {
        method: "GET"
    })
        .then(r => r.json())
        .then(r => {
            playerCards_header.textContent = r
            changeGameState()
        })
}

function takeCard() {
    fetch("http://localhost:8080/blackJack/playground/takeCard", {
        method: "GET"
    })
        .then(r => r.json())
        .then(r => playerCards_header.textContent = r)
}

function finishGame() {
    fetch("http://localhost:8080/blackJack/playground/finishGame", {
        method: "GET"
    })
        .then(r => r.json())
        .then(r => {
            alert(JSON.stringify(r))
            changeGameState()
            playerCards_header.textContent = "no cards, start the game"
        })
}

function changeGameState() {
    takeCard_btn.disabled = !takeCard_btn.disabled;
    finishGame_btn.disabled = !finishGame_btn.disabled;
    startGame_btn.disabled = !startGame_btn.disabled;
}