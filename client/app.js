let userName = null;
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on("newUser", (userName) => {
    addMessage("Chat Bot", userName + " has joined the conversation", true);
});
socket.on("userLeft", (userName) => {
    addMessage("Chat Bot", userName + " has left the conversation... :(", true);
});

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    login();
});


function login() {
    const userNameValue = userNameInput.value.trim();

    if (userNameValue === '') {
        alert('User name cannot be empty!'); 
    } else {
        userName = userNameValue; 
        socket.emit('join', userName);
        loginForm.classList.remove('show'); 
        messagesSection.classList.add('show');
    }
}

addMessageForm.addEventListener('submit', function(event){
    event.preventDefault();
    sendMessage();
});

function sendMessage () {
    const messageContent = messageContentInput.value.trim();

    if(!messageContent) {
        alert('Please enter a message.');
        return;
    }
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
}


function addMessage (author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    if(author === 'Chat Bot') message.classList.add('message--bot');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
}
