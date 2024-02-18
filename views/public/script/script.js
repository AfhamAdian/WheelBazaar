
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
        
        // fetch('/addtocart', {
        //   method: 'POST',
        //   headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({model_color_id,user_id})
        // }).then(res=>res.json())
        // .then(res=>{
        //   if(res.message == "ok") {
        //     alert("Successfully added to your cart");
        //   }
        // })
      }

      function generateProdecuts(data,id) {
        document.getElementById('searchRes').innerHTML="";
        for(let i=0;i<data.length;i++) {
        document.getElementById('searchRes').innerHTML+=`
        <div class="card mb-3">
        <div class="row no-gutters">
          <div class="col-md-4">
            <a href="/cardetails?car_id=${data[i].MODEL_COLOR_ID}&user_id=${id}">
              <img src="${data[i].CAR_IMAGE_URL}" class="card-img" style="height: 100%;"  alt="..." >
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <a class="card-title" href="/cardetails">${data[i].MODEL_NAME}</a>
              <p class="card-text">Price : ${data[i].PRICE}</p>
              <button class="btn btn-primary" name="add_to_cart_button" data-info="${data[i].MODEL_COLOR_ID}">Add to wishlist</button>
            </div>
          </div>
        </div>
        </div>`
        }
        var add_to_cart_buttons = document.getElementsByName('add_to_cart_button');

        for(var i = 0;i<add_to_cart_buttons.length;i++) {
          add_to_cart_buttons[i].addEventListener('click',function(){
            if(id != 0) {
              addToCart(this,id);
            }
            else {
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