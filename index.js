// get menu ul
const menuUl = document.getElementById('menuLi');

// fetch categories
async function loadMenu() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/categories');
        const data = await res.json();
        const menuList = data.categories;
        menuCategory(menuList);
    } catch (error) {
        console.log('something went wrong', error);
    }
}

// menu category function
const menuCategory = (menuList) => {
    menuUl.innerHTML = ""; // clear first
    menuList.forEach(category => {
        const categoryName = category.category_name;
        menuUl.innerHTML += `
      <li id="${category.id}" class="menu-list-item hover:bg-[#15803D]"><a>${categoryName}</a></li>
    `;
    });

    // attach click listeners after rendering
    setupMenuClicks();
}

// add click + active class toggle
function setupMenuClicks() {
    const menuListItems = document.querySelectorAll('.menu-list-item');

    menuListItems.forEach(el => {
        el.addEventListener('click', (e) => {
            // remove active from all
            menuListItems.forEach(item => item.classList.remove('active'));

            // add active only to the clicked li
            e.currentTarget.classList.add('active');
            let menuId = e.target.parentNode.id

            async function loadByCategory() {
                // 🔹 SHOW SPINNER
                document.getElementById('spinner').classList.remove('hidden');

                try {
                    const res = await fetch(`https://openapi.programming-hero.com/api/category/${menuId}`);
                    const data = await res.json();

                    gridCardParent.innerHTML = '';
                    const allPlants = data.plants;
                    plants(allPlants);
                } catch (error) {
                    console.log("Something went wrong:", error);
                } finally {
                    // 🔹 HIDE SPINNER (always runs even if error)
                    document.getElementById('spinner').classList.add('hidden');
                }
            }

            loadByCategory()
        });
    });

}

// call loadMenu()
loadMenu();


//--------------------------------------------//

// get grid Card Parent
const gridCardParent = document.getElementById('gridCardParent');

// Get 🌴All Plants api fetch loadMenu  function
async function allPlants() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/plants')
        const data = await res.json()
        // console.log(data.plants)
        const allPlants = data.plants
        plants(allPlants)

    } catch (error) {
        console.log('something went wrong', error);
    }
}


// plants function
const plants = (Plants) => {
    // console.log(plants)

    gridCardParent.innerHTML = ''

    Plants.forEach(plant => {
        // console.log(plant)
        gridCardParent.innerHTML += `
        <div class="card bg-base-100 shadow-sm flex flex-col">
  <!-- Fixed height image -->
  <figure class="h-48">
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-full object-cover" />
  </figure>

  <!-- Card body grows to equalize height -->
  <div class="card-body flex flex-col">
    <!-- Title -->
    <h2 class=" card-modal-button card-title text-start">${plant.name}</h2>

    <!-- Description -->
    <p class="text-sm flex-grow">
      ${plant.description}
    </p>

    <!-- Category + Price Row -->
    <div class="flex justify-between items-center w-full mt-auto">
      <button  id ="${plant.id}"
        class="btn btn-sm btn-outline border-green-600 text-green-600 hover:bg-white ">
        ${plant.category}
      </button>
      <span class="font-semibold text-lg text-green-600">৳${plant.price}</span>
    </div>

    <!-- Full width Add to Cart -->
    <button class="btn bg-[#15803D] text-white w-full mt-3">
      Add To Cart
    </button>
  </div>
</div>

        
        `
        showCardDetails()
    });


}

// get card-modal-button click and show data


function showCardDetails() {
    const cardModalButtons = document.querySelectorAll('.card-modal-button');

    cardModalButtons.forEach(el => {
        el.addEventListener('click', (e) => {
            // 🔹 SHOW SPINNER
            document.getElementById('spinner').classList.remove('hidden');

            let btnId = e.target.parentNode.parentNode.children[1].children[2].children[0].id;

            async function modalData() {
                try {
                    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${btnId}`);
                    const data = await res.json();
                    let plantsData = data.plants;

                    document.getElementById('modalTitle').innerText = plantsData.name;
                    document.getElementById('modalImage').src = plantsData.image;
                    document.getElementById('modalCategory').innerText = plantsData.category;
                    document.getElementById('modalPrice').innerText = "৳" + plantsData.price;
                    document.getElementById('modalDescription').innerText = plantsData.description;

                    document.getElementById('plantModal').showModal();
                } catch (error) {
                    console.log("Something went wrong:", error);
                } finally {
                    // 🔹 HIDE SPINNER (after fetch completes, success or fail)
                    document.getElementById('spinner').classList.add('hidden');
                }
            }

            modalData();
        });
    });
}


// get add-to-cart click and show data in cartItem
const cartDataShow = document.getElementById('cartItem');
cartDataShow.innerHTML = '';

const total = document.getElementById('total');


// function to calculate and update total
function updateTotal() {
    let sum = 0;
    // loop all cart item prices
    document.querySelectorAll('#cartItem .cart-item p').forEach(p => {
        // remove ৳ and convert to number
        let price = parseInt(p.innerText.replace(/[^\d]/g, ''), 10);
        sum += price;
    });
    total.innerText = 'Total: ৳' + sum;
}

gridCardParent.addEventListener('click', (e) => {
    // check if the clicked element is the "Add To Cart" button
    if (e.target.innerText === 'Add To Cart') {
        const card = e.target.closest('.card');

        const title = card.querySelector('h2').innerText;
        const price = card.querySelector('span').innerText; // e.g. ৳350

        // add cart item
        cartDataShow.innerHTML += `
      <div class="cart-item flex justify-between items-center p-1">
        <div>
          <h1 class="text-sm font-bold">${title}</h1>
          <p class="pt-1">${price}</p>
        </div>
        <button class="remove-btn text-red-500">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;

        updateTotal(); // recalc after adding
    }
});

// ✅ Handle remove button clicks (event delegation)
cartDataShow.addEventListener('click', (e) => {
    if (e.target.closest('.remove-btn')) {
        const cartItem = e.target.closest('.cart-item');
        cartItem.remove();
        updateTotal(); // recalc after removing
    }
});




// call allPlants()
allPlants()


