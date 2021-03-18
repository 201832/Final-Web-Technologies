$(document).ready(function(){
    var id = localStorage.getItem('id');
    console.log(id)
    
      function getUserData() {
        let search_url = "http://localhost:3000/users/"+localStorage.getItem('id');
        return new Promise((resolve, reject) => {
          $.ajax({
            url: search_url,
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

      getUserData().then((data) => {
        console.log(data);
        fillUserInfo(data);
      }).catch((error) => {
          console.log(error)
      })

      function fillUserInfo(data){
        const container = $('#user-info')
        var other = ''
        if(data['gender']==='female'){
          other='male';
        }else{
          other = 'female';
          console.log('other',other)
        }
        container.empty()
        container.append(
          `<div class='row'><h2>Email:</h2><div class='custom-row row'><p class='col-sm-3'>${data['email']}</p>
          <input class='col-sm-3' type="email" id="email" name="email" value=${data['email']}></div></div>
          <div class='row'><h2>First Name:</h2><div class='custom-row row'><p class='col-sm-3'>${data['fname']}</p>
          <input class='col-sm-3' type="text" id="fname" name="fname" value=${data['fname']}></div></div>
          <div class='row'><h2>Second Name:</h2><div class='custom-row row'><p class='col-sm-3'>${data['sname']}</p>
          <input class='col-sm-3' type="text" id="sname" name="sname" value=${data['sname']}></div></div>
          <div class='row'><h2>Gender:</h2><div class='custom-row row'><p class='col-sm-3'>${data['gender']}</p>
          <select class='col-sm-3' id="gender" name="gender">
          <option selected = "true" value=${data['gender']}>${data['gender']}</option>
          <option value=${other}>${other}</option></select>
          </div></div>
          <input type="submit" id="edit" value="save">
        `)}

        function ValidateEmail(){
          var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if($('#email').val().match(mailformat)){
              return true;
          }
          else{
              return false;
          }
      }


      function getUsers() {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: "http://localhost:3000/users",
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

    function checkEmail(email){
        getUsers().then((data) => {
            for (var user of data) {
                if(user['email']===email){
                    return true
                }
            }
            return false
        }).catch((error) => {
            console.log(error)
        })
    }

    let errors = []
    function editProfile(e){
      $('.errors').text('')
      $('#success').text('')
      e.preventDefault();
      console.log('asd')
      var isValidEmail = ValidateEmail();
      var emailEntered = $("#email").val()
      var emailExists = checkEmail(emailEntered)
      if (!isValidEmail){
          errors.push('invalid email')
      }
      if (emailExists){
        errors.push('email exists')
    }
      if (errors.length!==0){
          var ers = $(".errors").append("<ul class ='ers' ></ul>").find('ul');
          for (var i = 0; i < errors.length; i++)
              ers.append(`<li class="item-error">${errors[i]}</li>`);
          $(".errors").css('display','block');
          errors = []
          return 0
      }
      var ar = $("#profile :input").serializeArray();
      var json_obj = {};
      $.each(ar, function() {
          json_obj[this.name] = this.value || '';
      });
      $.ajax({
         type: "PATCH",
         url: "http://localhost:3000/users/"+localStorage.getItem('id'),
         data: json_obj,
          success: function(){
            console.log("succesful patch")
            $('#success').text("Edited successfully, please refresh page");
          },
          dataType: "json"
      });
  }


  function getCars() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "http://localhost:3000/users/"+localStorage.getItem('id'),
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
  getCars().then(function(data){
    
    var products = data["CarFavourites[]"]
    console.log('cars',products)
      const container = $('#cars')
      container.empty()
      // products.map((product,idx)=>{
      //     if(idx%2==0){
      //         container.append("<div class='row'></div>")
      //     }
      //     $("#products " + ".row:nth-child("+(Math.floor(idx/2)+1).toString()+')').append(`
      //     <div class='product col-sm-6'>
      //         <h2 class="brand">${product.brand.toUpperCase()}</h2>
      //         <h3 class="model">${product.model.toUpperCase()}</h3>
      //         <img class = 'vehicle_img' src=${product.path}></img>
      //         <p class="price">Price:${product.price} ${product.currency}</p>
      //         <button id="${product.id}" type="button" class="addToFavorite">Add to favourite</button>
      //     </div>
      //     `)
      // }) 



  }).catch()



  const targetNode = document.getElementById('user-info');

  // Options for the observer (which mutations to observe)
  const config = { childList: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
      for(const mutation of mutationsList) {
          if (mutation.type === 'childList') {
              $('#edit').click(function(e){
                  console.log('works')
                editProfile(e)
              })
              break
          }
          else if (mutation.type === 'attributes') {
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
      }
  };
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);


})