$(document).ready(function(){
  console.log("application.js working")

  $('#signin').submit(function(){
    event.preventDefault();

    console.log("submitting");
    var email = $('form > input[name="email"]');
    var name = $('form > input[name="name"]');
    var username = $('form > input[name="username"]');
    var password = $('form > input[name="password"]');

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/users',
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
        if (response.ok === 1) {
          console.log("success!");
          email.val('');
          name.val('');
          username.val('');
          password.val('');
        }
      },
      error: function(xhr, status, error){
        $('#signin-form-message').text(xhr.responseText);
      }
    });
  });
});