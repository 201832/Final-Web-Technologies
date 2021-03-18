$(document).ready(function(){
    var authorized = localStorage.getItem('id');
    if(authorized!=null){
        $('.container').css("visibility","visible");
        $('.not_logged').css("visibility","hidden");
    }else{
        $('.container').css("visibility","hidden");
        $('.not_logged').css("visibility","visible");
        console.log("no value")
    }


    var slider = document.getElementById('slider');

    noUiSlider.create(slider, {
        connect: true,
        behaviour: 'tap',
        start: [500, 4000],
        range: {
            // Starting at 500, step the value by 500,
            // until 4000 is reached. From there, step by 1000.
            'min': [0],
            '10%': [500, 1000],
            '30%': [10000, 5000],
            'max': [500000]
        }
    });

    function createFilter(filterField, filterValue){
        return function(vehicle){
            if(vehicle[filterField].toLowerCase()===filterValue.toLowerCase()){
                return vehicle;
            }
        }
    }
    function priceFilter(vehicle){
        let lower = $('#lower-value').text()
        lower = parseInt(lower.split('.')[0])
        let higher = $('#upper-value').text()
        higher= parseInt(higher.split('.')[0])
        if(vehicle.price>=lower && vehicle.price<=higher){
            return vehicle;
        }
    }

    // function getFavourites() {
        
        
        
    //     return new Promise((resolve, reject) => {
    //       $.ajax({
    //         url: search_url,
    //         type: 'GET',
    //         success: function (response) {
    //           resolve(response)
    //         },
    //         error: function (error) {
    //           reject(error)
    //         },
    //       })
    //     })
    //   }

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

     


         //var favs = getFavourites()
        //  .then((data) => {
        //   var favs = []
        //   favs = [...data[propertyName]]
        //   console.log(favs);
        //     return favs
        // }).catch((error) => {
        //     console.log(error)
        // })
        

        function closeModal() {
    modal.style.display = "none";
}
function addToFav(item) {
    let ls = localStorage.getItem("user");
    let c = JSON.parse(ls);
    if (!("fav" in c)) {
        c.fav = [item];
    } else {
        let check = c.fav.find(t => t === item);
        if (!check) {
            c.fav.push(item);
        }
    }
    localStorage.setItem("user", JSON.stringify(c));
}

        
        function addToFavorites(e) {
          var favs=[]
          let search_url1 = "http://localhost:3000/users/"+localStorage.getItem('id');
          $.get( search_url1, function( data ) {
              console.log('hereasdas',data)
              let search_url = "http://localhost:3000/users/"+localStorage.getItem('id');

              
    
              var propertyName = ''
              var vehicleType = $('select[name=vehicles] option').filter(':selected').val();
              var obj = {}
              if(vehicleType==='cars'){
                propertyName = 'CarFavourites[]'
              }else if(vehicleType==='bikes'){
                propertyName = 'BikeFavourites[]'
              }else{
                propertyName = 'PlaneFavourites[]'
              }
              if(!data[propertyName]){
                favs =[]
              }else{
                favs = [...data[propertyName]]
              }
              console.log("please",favs)
              if (!favs.includes(e.target.id)){
                  favs.push(e.target.id)
                  console.log('type',typeof e.target.id)
              }
    
            obj[propertyName]=favs
            return new Promise((resolve, reject) => {
              $.ajax({
                url: search_url,
                type: 'PATCH',
                data: obj,
                success: function (response) {
                  resolve(response)
                },
                error: function (error) {
                  reject(error)
                },
              })
            })
          });
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
                <button id="${product.id}" type="button" class="addToFavorite">Add to favourite</button>
            </div>
            `)
        }) 
    }

      $('#search').click(function(e){
        e.preventDefault();
        var vehicleType = $('select[name=vehicles] option').filter(':selected').val();
        const lower = $('#lower-value').text()
        console.log('asd'+lower)
        getVehicles(vehicleType.toLowerCase()).then((data) => {
            console.log(data);
            const filters = []
            const brandVal =  $('#brand').val()
            const brandFilter = createFilter('brand', brandVal)
            if(brandVal!==""){
                filters.push(brandFilter)
            }
            filters.push(priceFilter)
            const filteredData = data.filter(vehicle => filters.every(f => f(vehicle)))
            console.log(filteredData)
            fillProducts(filteredData)
            
        }).catch((error) => {
            console.log(error)
        })
      })


      // Select the node that will be observed for mutations
    const targetNode = document.getElementById('products');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                $('button').click(function(e){
                  addToFavorites(e)
                })
                break
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);


      


    // //Pages functionnality 
    // var current_page = 1;
    // var records_per_page = 4;


    // function prevPage()
    // {
    //     if (current_page > 1) {
    //         current_page--;
    //         changePage(current_page);
    //     }
    // }

    // function nextPage()
    // {
    //     if (current_page < numPages()) {
    //         current_page++;
    //         changePage(current_page);
    //     }
    // }
    // $("#btn_next").on("click",nextPage)
    // $("#btn_prev").on("click",prevPage)

    // function changePage(page,products){
    //     var btn_next = $("#btn_next");
    //     var btn_prev = $("#btn_prev");
    //     var container = ("#products");
    //     var page_span = $("#page");

    //     // Validate page
    //     if (page < 1) page = 1;
    //     if (page > numPages()) page = numPages();

    //     container.empty()

    //     products.map((product,idx=current_page-1)=>{
    //         if(idx===current_page*(records_per_page)-1){
    //             break
    //         }
    //         if(idx%2==0){
    //             container.append("<div class='row'></div>")
    //         }
    //         $("#products " + ".row:nth-child("+(Math.floor(idx/2)+1).toString()+')').append('<p>Product</p>')
    //     }) 

    //     page_span.val(page);

    //     if (page == 1) {
    //         btn_prev.css("visibility", "hidden");
    //     } else {
    //         btn_prev.css("visibility" = "visible");
    //     }

    //     if (page == numPages()) {
    //         btn_next.css("visibility","hidden");
    //     } else {
    //         btn_next.css("visibility","visible");
    //     }
    // }
    // changePage(1);

    // function numPages(){
    //     return Math.ceil(products.length / records_per_page);
    // }

    var nodes = [
        document.getElementById('lower-value'), // 0
        document.getElementById('upper-value')  // 1
    ];

    slider.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
        nodes[handle].innerHTML = values[handle] + '$';
    });
})