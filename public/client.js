const socket = io()

let verify;
let username;
let usersmail;
let input = document.querySelector('#type_message')
let messageArea = document.querySelector("[id='message__area']");

do {
    verify = confirm('Are You Aspirian?')
} while (!verify);


do {
    username = prompt('Enter Your Name To Join Chat: ')
} while (!username);

socket.emit('new-user-joined',username);

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
});

function userJoinLeft(user,status){
    let div=document.createElement('div');
    div.classList.add('user-join');
    let content=`<p><b>${user}</b> ${status} The Chat</p>`;
    div.innerHTML=content;
    messageArea.appendChild(div);

    // setTimeout(() => {
    //     div.remove();
    // }, 10000);
}

socket.on('user-disconnected',(socket_name)=>{
    userJoinLeft(socket_name, 'left')
});

input.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value);
    }
    
})


function sendMessage(message){
    let msg={
        user : username,
        message : message.trim()
    }
    // Append
    appendMessage(msg, 'right')
    input.value=''
    ScrollBottom();


    
    // Send To Server

    socket.emit('message',msg)
    
}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className,'message')

    let markup =`
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `

    mainDiv.innerHTML= markup
    messageArea.appendChild(mainDiv)
}

// Receive Messages

socket.on('message',(msg)=>{
    appendMessage(msg,'left')
    ScrollBottom()
})



function ScrollBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}