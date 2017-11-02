var socket = io();

socket.on('connect', function () {
  console.log('Connect to server');
});

socket.on('newMessage', function (newMessage) {
  console.log('New message from server', newMessage);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});