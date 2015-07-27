$(document).ready(function(){
  var getAllTweets = function(){
    $.ajax({
      type: 'GET',
      url: 'tweets',
      success: function(response){
        var html = '';

        response.forEach(function (tweet) {
          html += '<div>';
          html +=   tweet.message;
          html += '</div>';
        });

        $('#tweets').html(html);
      },
      error: function(xhr, status, error){
        console.log(xhr.responseText);
      }
    });
  };

  getAllTweets();

  $('#tweet-submit').submit(function(){
    event.preventDefault();

    $.ajax({
      type: 'POST',
      url: 'tweets',
      data: {
        tweet: {
          message: $('#tweet-submit > input[name="message"]').val()
        }
      },
      dataType: 'JSON',
      xhrFields: {
        withCredentials: true
      },
      success: function(response){
        console.log(response);
        getAllTweets();
      },
      error: function(xhr, status, error){
        console.log(xhr.responseText);
      }
    })
  });
});