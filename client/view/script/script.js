(function () {

    const messageInputButton = document.getElementById('message-input-button');

    const socket = io.connect({'sync disconnect on unload': true });


    NameEnter(socket);
    socket.on('new users', function (user) {
        createUsersList(user);
    });
    socket.on('users list', function (users) {
        users.forEach(item=>{
            createUsersList(item);
        })

    });


    socket.on('chat history', function (message) {
        const userNameField = document.getElementById('messages-container');
        userNameField.innerHTML = '';
        message.forEach(item => {
            createMessageViews(item);
        })
    });

    messageInputButton.onclick = function () {
        const messageInputField = document.getElementById('message-input-field');
        let date = new Date();

        let message = {
            'name': sessionStorage.getItem('userName'),
            'nick': sessionStorage.getItem('nickName'),
            'time': date.getHours() + ":" + date.getMinutes() + " " + date.getDay() + "." +
            date.getMonth() + "." + date.getDate(),
            'text': messageInputField.value
        };
        socket.emit('chat message', message);


        messageInputField.value = '';
    };

    socket.on('chat message', function (message) {
        createMessageViews(message);

    });

   document.getElementById('message-input-field').onkeypress = function(){
       socket.emit('user typing', sessionStorage.getItem('nickName'));
       socket.on('is typing', function (user) {
           console.log(user);
       })
   };


}());


function NameEnter(socket) {

    const popUp = document.getElementById('pop-up');

    const userNameField = document.getElementById('username-field');
    const nickNameField = document.getElementById('nickname-field');
    const popUpButton = document.getElementById('nickname-submit');


    popUpButton.onclick = function () {
        if (userNameField.value !== '' && nickNameField.value !== '') {
            sessionStorage.setItem('userName', userNameField.value);
            sessionStorage.setItem('nickName', nickNameField.value);
            popUp.style.display = 'none';
            socket.emit('new user', {'username' : userNameField.value, 'nickname':nickNameField.value});
            // socket.on('new user', function (user) {
            //     const userNameField = document.getElementById('messages-container');
            //     userNameField.innerHTML = '';
            //     user.forEach(item => {
            //         createUsersList(item);
            //     })
            // });
        } else {
            alert("Enter username and nickname");
        }
    };
}


function createMessageViews(message, i) {


    const userNameField = document.getElementById('messages-container');
    const contentWrapper = document.createElement('li');
    console.log(i);
    contentWrapper.setAttribute('class', i ? "left-side" : "right-side");

    const nicknameStart = message.text.indexOf("@") + 1;
    if (nicknameStart) {
        const search = message.text.substring(
            nicknameStart,
            message.text.indexOf(" ", nicknameStart)
        );
        if(sessionStorage.getItem('nickName')===search){
            contentWrapper.setAttribute('class', 'private-message')
        }
    }




    const header = document.createElement('h5');
    const messageText = document.createElement('p');
    const timeDisplay = document.createElement('p');

    userNameField.appendChild(contentWrapper);
    contentWrapper.appendChild(header);
    contentWrapper.appendChild(timeDisplay);
    contentWrapper.appendChild(messageText);
    header.innerHTML = message.name + "(@" + message.nick + ")";

    messageText.innerHTML = message.text;
    timeDisplay.innerHTML = message.time;

    document.getElementsByClassName('messages-wrapper')[0].scrollTo(0, document.getElementsByClassName('messages-wrapper')[0].getBoundingClientRect().bottom);


}


function createUsersList(user) {
    const chatMatesList = document.getElementById("chatmates-list");

    const userWrapper = document.createElement('li');

    chatMatesList.appendChild(userWrapper);
    console.log(user);
    userWrapper.innerHTML = user.username + "(@" + user.nickname + ")";

}