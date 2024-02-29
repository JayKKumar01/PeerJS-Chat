const peerBranch = "JayKKumar01-";
const randomId = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit number
const peerId = `${peerBranch}${randomId}`;
const peer = new Peer(peerId);

const logsTextarea = document.getElementById('logs');
const messagesContainer = document.getElementById('messages-container'); // Corrected reference
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const targetPeerIdInput = document.getElementById('targetPeerId');
const connectButton = document.getElementById('connectButton');
let conn;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    appendLog(`My ID is: ${randomId}`);
});

peer.on('open', function (id) {
    appendLog(`Connected!`);
});

peer.on('connection', function (connection) {
    conn = connection;
    var remoteId = conn.peer;
    remoteId = remoteId.replace(peerBranch,'');
    appendLog(`Connected to ${remoteId}`);

    conn.on('data', function (data) {
        appendMessage(data, 'left');
    });

    // Show the message input and send button when the connection is established
    showMessageInput();
});

function connectAndSendMessage() {
    const targetPeerId = targetPeerIdInput.value.trim();

    if (targetPeerId !== '') {
        conn = peer.connect(peerBranch + targetPeerId);
        appendLog(`Connecting to ${targetPeerId}`);

        conn.on('open', function () {
            appendLog(`Connected to ${targetPeerId}`);
            targetPeerIdInput.value = ''; // Clear the input field
            // Show the message input and send button when the connection is established
            showMessageInput();
        });

        conn.on('data', function (data) {
            appendMessage(data, 'left');
        });
    }
}

// ... Your existing code ...

document.addEventListener('DOMContentLoaded', function() {
    // ... Your existing code ...

    // Add an event listener for the 'keydown' event on the messageInput textarea
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // If the Enter key is pressed, prevent the default behavior (new line) and send the message
            event.preventDefault();
            sendMessage();
        }
    });
});

// ... Your existing code ...

function sendMessage() {
    const message = messageInput.value.trim();

    if (message !== '' && conn && conn.open) {
        appendMessage(message, 'right');
        conn.send(message);
        messageInput.value = '';
    }
}


function appendMessage(message, position) {
    const messageElement = document.createElement('textarea');
    messageElement.textContent = message;

    // Common styling for both left and right messages
    messageElement.className = 'message';

    // Add specific class based on position
    if (position === 'right') {
        messageElement.classList.add('right');
    } else {
        messageElement.classList.add('left');
    }

    // Make the textarea read-only to prevent user input
    messageElement.readOnly = true;

    
    messagesContainer.appendChild(messageElement);
    messageElement.style.height = messageElement.scrollHeight + 'px';

    // Add a "Copy" button to the top right of the message
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-button';
    messagesContainer.appendChild(copyButton);

    // Event listeners for the "Copy" button
    copyButton.addEventListener('click', function () {
        copyToClipboard(messageElement.value);
        copyButton.textContent = 'Copied'; // Change text to "Copied" on click
        setTimeout(() => {
            copyButton.textContent = 'Copy'; // Change back to "Copy" after one second
        }, 1000);
    });

    // Event listener for the "Copy" button
    copyButton.addEventListener('click', function () {
        copyToClipboard(messageElement.value);
    });



    // Scroll to the top of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function appendLog(log) {
    logsTextarea.value += log + '\n';
    // Scroll to the bottom to show the latest log
    logsTextarea.scrollTop = logsTextarea.scrollHeight;
}

function showMessageInput() {
    // Show the message input and send button
    messageInput.style.display = 'block';
    sendButton.style.display = 'block';

    //hide connect button
    targetPeerIdInput.style.display = 'none';
    connectButton.style.display = 'none';
}
