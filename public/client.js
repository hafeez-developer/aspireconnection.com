const socket = io();

let verify;
let username;
let chats = document.querySelector(".chats");
let users_list = document.querySelector(".users-list");
let users_count = document.querySelector(".users-count");
let msg_send = document.querySelector("#msg-send");
let user_msg = document.querySelector("#user-msg");
let input = document.querySelector('input');

do {
  verify = confirm("Are You Aspirian?");
} while (!verify);

do {
  username = prompt("Enter Your Name To Join Chat: ");
} while (!username);

socket.emit("new-user-joined", username);

socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});

function userJoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("user-join");
  let content = `<p><b>${name}</b> ${status} The Chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);

//   setTimeout(() => {
//     div.remove();
//   }, 10000);
}

socket.on("user-disconnected", (user) => {
  userJoinLeft(user, "left");
});

socket.on("user-list", (users) => {
  users_list.innerHTML = ``;
  users_arr = Object.values(users);
  for (i = 0; i < users_arr.length; i++) {
    let p = document.createElement("p");
    p.innerText = users_arr[i];
    users_list.appendChild(p);
  }
  users_count.innerHTML = users_arr.length;
});

// input.addEventListener("keyup", (e) => {
//   if (e.key == "Enter") {
//     appendMessage(e.target.value);
//   }
// });

msg_send.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  if ((user_msg.value == "")) {
    appendMessage();
    socket.emit("console",data)
  } 
  if (user_msg != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    user_msg.value = "";
  }

});

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}
socket.on("message", (data) => {
  appendMessage(data, "incoming");
  ScrollBottom();
});

// function sendMessage(message) {
//   let msg = {
//     user: username,
//     message: message.trim(),
//   };
// Append
//   sendMessage(msg, "outgoing");
//   input.value = "";
//   ScrollBottom();

//   // Send To Server

//   socket.emit("message", msg);
// }

// function appendMessage(msg, type) {
//   let mainDiv = document.createElement("div");
//   let className = type;
//   mainDiv.classList.add(className, "message");

//   let markup = `
//         <h4>${msg.user}</h4>
//         <p>${msg.message}</p>
//     `;

//   mainDiv.innerHTML = markup;
//   chats.appendChild(mainDiv);
// }

// // Receive Messages

function ScrollBottom() {
  chats.scrollTop = chats.scrollHeight;
}

let uwindow = document.querySelector(".users-window");
let toggle = document
  .querySelector("#menu-btn")
  .addEventListener("click", show_hide);
function show_hide() {
  if (uwindow.style.display == "block") {
    uwindow.style.display = "none";
  } else {
    uwindow.style.display = "block";
  }
}
