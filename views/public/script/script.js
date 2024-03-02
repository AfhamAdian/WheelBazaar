
      function fetchResultsByName(event,id) {
        event.preventDefault();
        const name = document.getElementById('searchBar').value;
        console.log(name);
        fetch('/searchByCarName',{
        method: 'POST',
        headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({name})
        })
        .then(res=>res.json())
        .then(data=>{
          generateProdecuts(data,id);
        })
        }

      function addToCart(button,id) {
        var model_color_id = button.dataset.info;
        var user_id = id;
        
        fetch('/addtocart', {
          method: 'POST',
          headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({model_color_id,user_id})
        }).then(res=>res.json())
        .then(res=>{
          if(res.message == "ok") {
            
            alert( "Added to cart" );
          }
        })
        
      }

      function generateProdecuts(data,id) {
        document.getElementById('searchRes').innerHTML="";
        for(let i=0;i<data.length;i++) {
        document.getElementById('searchRes').innerHTML+=`
        <div class="card mb-3">
    <div class="row no-gutters">
        <div class="col-md-4">
            <a href="/cardetails?car_id=${data[i].MODEL_COLOR_ID}&user_id=${id}">
                <img src="${data[i].CAR_IMAGE_URL}" class="card-img" style="height: 100%;" alt="...">
            </a>
        </div>
          <div class="col-md-4">
              <div class="card-body">
                  <a class="card-title" href="/cardetails?car_id=${data[i].MODEL_COLOR_ID}&user_id=${id}">${data[i].MODEL_NAME}</a>
                  <br>
                  <a class="card-text" style="font-weight: 100; font-size:20px;" href="${data[i].COMPANY_URL}">${data[i].NAME}</a>
                  <br>
                  <a class="card-text" style="font-weight: 100; font-size:20px;" href="${data[i].CAR_TYPE_URL}">${data[i].TYPE_NAME}</a>
                  <br>
                  <p class="card-text">Color: ${data[i].COLOR}</p>
              </div>
          </div>
          <div class="col-md-4">
            <div class="card-body">
              <p class="card-text">Price: ${data[i].PRICE}</p>
              <p class="card-text">
              Stock: <span style="color: ${data[i].STOCK !== 0 ? '#00cc00' : '#ff0000'}; font-weight: bold; font-style: italic;">
                  ${data[i].STOCK !== 0 ? '<strong><em>In stock</em></strong>' : '<strong><em>Out of stock</em></strong>'}
              </span>
              </p>
              <p class="card-text">Warranty: ${data[i].WARRANTY} years</p>
            </div>
            <div class="">
              <button class="add_to_cart_button_index" name="add_to_cart_button" data-info="${data[i].MODEL_COLOR_ID}" ${data[i].STOCK === 0 ? 'disabled="disabled" style="cursor: not-allowed;"' : ''}>Add to wishlist</button>
            </div>
          </div>
    </div>
</div>
    `
        }
        var add_to_cart_buttons = document.getElementsByName('add_to_cart_button');

        for(var i = 0;i<add_to_cart_buttons.length;i++) {
          add_to_cart_buttons[i].addEventListener('click',function(){
            if(id != 0) {
              addToCart(this,id);
              console.log( "added to cart" );
            }
            else {
              alert( "Please login to add to cart" );
              window.location.href = '/login';
            }
          });
        }
        }

        function fetchResultsBrand(button,id) {
        // Access the text content of the clicked button
        var buttonText = button.textContent || button.innerText;
        console.log(buttonText);
        // Log or perform other actions with the button text
        fetch('/showBrandWise',{
        method: 'POST',
        headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({buttonText})
        })
        .then(res=>res.json())
        .then(data=>{
          generateProdecuts(data,id);
        })
        }
        
        function fetchResultsType(button,id) {
        // Access the text content of the clicked button
        var buttonText = button.textContent || button.innerText;
        //console.log(buttonText);
        // Log or perform other actions with the button text
        fetch('/showTypeWise',{
        method: 'POST',
        headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({buttonText})
        })
        .then(res=>res.json())
        .then(data=>{
          generateProdecuts(data,id);
        })
        }

        function toggleSidebar() {
        var sidebar = document.getElementById('sidebar');
        sidebar.style.right= sidebar.style.right === '0px' ? '-250px' : '0px';
        }