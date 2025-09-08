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
                const res = await fetch(`https://openapi.programming-hero.com/api/category/${menuId}`)
                const data = await res.json()
                gridCardParent.innerHTML = ''
                const allPlants = data.plants
                plants(allPlants)
                // console.log(data)
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
            //   const btn = e.currentTarget;
            let btnId = e.target.parentNode.parentNode.children[1].children[2].children[0].id;

            async function modalData() {
                const res = await fetch(`https://openapi.programming-hero.com/api/plant/${btnId}`);
                const data = await res.json();
                let plantsData = data.plants;

                document.getElementById('modalTitle').innerText = plantsData.name;
                document.getElementById('modalImage').src = plantsData.image;
                document.getElementById('modalCategory').innerText = plantsData.category;
                document.getElementById('modalPrice').innerText = "৳" + plantsData.price;
                document.getElementById('modalDescription').innerText = plantsData.description;

                document.getElementById('plantModal').showModal();
            }


            modalData()


        });
    });
}



// call allPlants()
allPlants()


