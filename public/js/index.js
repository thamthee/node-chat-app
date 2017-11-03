var socket = io();
var locationButton = jQuery('#send-location');

// MARK: Socket
socket.on('connect', function () {
  console.log('Connect to server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template ,{
    text: message.text,
    from: message.from,
    createAt: formattedTime
  });

  jQuery('#message').append(html);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createAt: formattedTime
  })

  jQuery('#message').append(html);
});

// MARK: jQuery
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not support on this brower.');
  };

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.')
  });
});