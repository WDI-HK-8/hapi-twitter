$(document).ready(function(){
  // var host = process.env.APP_URL || 'http://localhost:3000';

  $('#signup').submit(function(){
    event.preventDefault();

    var email = $('#signup > input[name="email"]');
    var name = $('#signup > input[name="name"]');
    var username = $('#signup > input[name="username"]');
    var password = $('#signup > input[name="password"]');

    $.ajax({
      context: window,
      type: 'POST',
      url: 'users',
      data: {
        user: {
          email: email.val(),
          name: name.val(),
          username: username.val(),
          password: password.val()
        }
      },
      dataType: 'JSON',
      success: function(response){
        console.log(response);
      },
      error: function(xhr, status, error){
        $('#signup-form-message').text(xhr.responseText);
      }
    });
  });

  $('#signin').submit(function(){
    event.preventDefault();

    var username = $('#signin > input[name="username"]');
    var password = $('#signin > input[name="password"]');

    $.ajax({
      context: window,
      type: 'POST',
      url: 'sessions',
      data: {
        user: {
          username: username.val(),
          password: password.val()
        }
      },
      dataType: 'JSON',
      xhrFields: {
        withCredentials: true
      },
      success: function(response){
        if (response.authenticated) {
          window.location.href = "posts";
        }
      },
      error: function(xhr, status, error){
        console.log(xhr.responseText);
      }
    });
  });
});