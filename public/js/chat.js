var socket = io();
var locationButton = jQuery('#send-location');

function scrollToBotton () {
  //Selectors
  var message = jQuery('#message');
  var newMessage = message.children('li:last-child');
  //Height
  var clientHeight = message.prop('clientHeight');
  var scrollTop = message.prop('scrollTop');
  var scrollHeight = message.prop('scrollHeight');

  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    message.scrollTop(scrollHeight);
  }
}

// MARK: Socket
// Socket - Deparam
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

// Socket - Update user list
socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach( function (user) {
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery('#users').html(ol);
})

// Socket - Update new messages
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template ,{
    text: message.text,
    from: message.from,
    createAt: formattedTime
  });

  jQuery('#message').append(html);
  scrollToBotton();
});

// Socket - User disconnected
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Socket - Update new location message
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createAt: formattedTime
  })

  jQuery('#message').append(html);
  scrollToBotton();
});

// MARK: jQuery
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
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