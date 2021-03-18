$(document).ready(function(){

    function getGredentials(email) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: "http://localhost:3000/users?email="+email,
            type: 'GET',
            success: function (response) {
              resolve(response)
            },
            error: function (error) {
              reject(error)
            },
          })
        })
      }

    $('#submit').click(function(e){
        e.preventDefault();
        var emailEntered = $('#email').val();
        var passwordEntered = $('#password').val();
        getGredentials(emailEntered).then((data) => {
            if(data && data[0]['password']===passwordEntered){
                console.log('success');
                localStorage.setItem('id', data[0]['id']);
                console.log(localStorage.getItem('email'))
            }else{
                throw new Error('passwords do not match');
            }
            console.log(window.location.href)
            window.location.replace(window.location.href.slice(0,-10)+'index.html')
        }).catch((error) => {
            console.log(error)
        })
    })
})