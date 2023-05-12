
// Variable Set-Up ###################
const aiStatus = document.getElementById("ai-status");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-message-btn");
const clearBtn = document.getElementById("clear-btn");
// Templates
const aiMessage = document.getElementById("");


// ###################################

/*
    Generates a message bubble for the AI after
    receiving its mesasge.
*/
generateAIMessageBubble = function (message) {
    console.log(message);
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', { timezone: 'PST' });

    let aiMessageTemplate = document.getElementById("ai-message");
    let aiMessageDestination = document.getElementById("chat-destination");

    console.log(aiMessageTemplate);
    console.log(aiMessageTemplate.querySelector("#ai-message-content"));
    let actualMessage = aiMessageTemplate.content.cloneNode(true);
    console.log(actualMessage);
    actualMessage.querySelector("#ai-message-content").innerHTML = message;
    actualMessage.querySelector("#ai-message-time").innerHTML = formattedDate;

    aiMessageDestination.appendChild(actualMessage);
    aiMessageDestination.scrollIntoView();
}

/*
    Generates a message bubble for the user
    after receiving their message.
*/
generateUserMessageBubble = function (message) {
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', { timezone: 'PST' });

    const userMessageTemplate = document.getElementById("user-message");
    const userMessageDestination = document.getElementById('chat-destination');

    const actualMessage = userMessageTemplate.content.cloneNode(true);
    actualMessage.querySelector('#user-message-content').innerHTML = message;
    actualMessage.querySelector('#user-message-time').innerHTML = formattedDate;

    userMessageDestination.appendChild(actualMessage);
    userMessageDestination.scrollIntoView();
}

/*
    Automatically scrolls the content-container up, every time
    a new message bubble is added in.
*/

function scrollOnMessage() {
    const div = document.querySelector(".chat-container");
    div.scrollTop = div.scrollHeight;
}

async function sendMessageAndReceiveResponse() {
    const userMessage = chatInput.value;
    generateUserMessageBubble(userMessage);
    scrollOnMessage();
    chatInput.value = "";
    aiStatus.classList.remove("hidden");
    const request = { userMessage: userMessage };
    try {
        const response = await fetch("https://weak-rose-springbok-cape.cyclic.app/chat", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const data = await response.json();
        if (data.leftover == "") {
            generateAIMessageBubble("Sorry, I didn't understand that. Please type in full sentences and ask me relevant questions.");
            scrollOnMessage();
        } else if (data.leftover == undefined) {
            generateAIMessageBubble("I recorded that for you! Check the tracker!");
            scrollOnMessage();
        } else {
            generateAIMessageBubble(data.leftover);
            scrollOnMessage();
        }
        aiStatus.classList.add("hidden");
    } catch (err) {
        console.log(err);
        generateAIMessageBubble("Sorry, I didn't understand that. Please type in full sentences and ask me relevant questions.");
        scrollOnMessage();
        aiStatus.classList.add("hidden");
    }
}

// ###################################

/* 
    Submits the POST request when enter is pressed.
*/
document.addEventListener("keydown", (event) => {
    if (event.key === `Enter`) {
        sendMessageAndReceiveResponse();
    }
});

/*
    Submits the POST request when the button is pressed.
*/
sendBtn.addEventListener('click', sendMessageAndReceiveResponse);

/*
    Clears the content of the chat when pressed.
*/
clearBtn.addEventListener('click', () => {
    document.querySelector(".content-container").innerHTML = "";
});