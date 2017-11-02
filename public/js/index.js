var socket = io();

socket.on('connect', function () {
  console.log('Connect to server');
});

socket.on('newMessage', function (message) {
  console.log('New message from server', message);

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#message').append(li);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// socket.emit('createMessage', {
//   from: 'John',
//   text: 'Hola Everybody'
// }, function (data) {
//   console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});