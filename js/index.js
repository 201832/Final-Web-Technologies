$(document).ready(function(){

    let errors = [];
    var authorized = localStorage.getItem('id');
    if(authorized!=null){
        console.log('yes value')
        $('.authorized').css("visibility","visible");
        $('#login_menu').css("visibility","visible");
        $('#login').css("display","none");
        $('#registration').css("display","none");
        
    }else{
        $('.authorized').css("visibility","hidden");
        $('#login_menu').css("visibility","hidden");
        $('#login').css("display","block");
        $('#registration').css("display","block");
        console.log("no value")
    }





    function ValidateEmail(){
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if($('#email').val().match(mailformat)){
            return true;
        }
        else{
            return false;
        }
    }

    function checkPasswords(){
        var p1 = $('#password').val();
        var p2 = $('#password2').val();
        if(p1==="" || p2=== ""){
            errors.push('enter password twice')
        }else if(p1!==p2){
            errors.push('passwords do not match')
        }
    }
    function emptyFields(){
        $('#password').val("");
        $('#password2').val("");
        $('#email').val("");
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

    $('#logout').click(function(e){
        console.log('Bye');
        localStorage.removeItem('id')
        window.location.reload(true);

    })  
      
    $('#submit').click(function(e){
        e.preventDefault();
        if($('.ers')){
            $('.ers').remove()
        }
        checkPasswords()
        var isValidEmail = ValidateEmail();
        var emailEntered = $("#email").val()
        var emailExists = checkEmail(emailEntered)
        console.log(emailExists)
        if (!isValidEmail){
            errors.push('invalid email')
        }
        if (errors.length!==0){
            emptyFields()
            var ers = $(".errors").append("<ul class ='ers' ></ul>").find('ul');
            for (var i = 0; i < errors.length; i++)
                ers.append(`<li class="item-error">${errors[i]}</li>`);
            $(".errors").css('display','block');
            errors = []
            return 0
        }
        var id = Math.floor(Math.random() * 1000000)
        var ar = $("#form-container :input").serializeArray();
        var json_obj = {};
        json_obj["id"] = id
        $.each(ar, function() {
            json_obj[this.name] = this.value || '';
        });
        delete json_obj['password2'];
        json_obj['CarFavourites'] = []
        json_obj['BikeFavourites'] = []
        json_obj['PlaneFavourites'] = []
        var test_obj = { "id": 265465, "email": "Adilet@gmail.ru", "fname": "1", "sname": "1", "password": "123456", "gender": "male" }
        console.log(test_obj)

        $.ajax({
           type: "POST",
           url: "http://localhost:3000/users",
           data: json_obj,
            success: function(){
                $('#success').text("registered successfully");
                window.location.replace(window.location.href.slice(0,-17)+'index.html')
            },
            dataType: "json"
        });
    });

    function getVehicles(vehicleType) {
        let search_url = "http://localhost:3000/"+vehicleType;

        console.log(search_url)
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
      function fillProducts(products){
        const container = $('#products')
        container.empty()
        products.map((product,idx)=>{
            if(idx%2==0){
                container.append("<div class='row'></div>")
            }
            $("#products " + ".row:nth-child("+(Math.floor(idx/2)+1).toString()+')').append(`
            <div class='product col-sm-6'>
                <h2 class="brand">${product.brand.toUpperCase()}</h2>
                <h3 class="model">${product.model.toUpperCase()}</h3>
                <img class = 'vehicle_img' src=${product.path}></img>
                <p class="price">Price:${product.price} ${product.currency}</p>
            </div>
            `)
        }) 
    }

      $('.catalog').click(function(e){
        e.preventDefault();
        console.log('catalog')
        var vehicleType = e.target.text;
        console.log(vehicleType)
        const lower = $('#lower-value').text()
        console.log('asd'+lower)
        getVehicles(vehicleType.toLowerCase()).then((data) => {
            console.log(data);
            fillProducts(data)
        }).catch((error) => {
            console.log(error)
        })
      })



}); 

