// get elements
const menuUl = document.getElementById('menuLi');
const gridCardParent = document.getElementById('gridCardParent');
const spinner = document.getElementById('spinner');
const cartDataShow = document.getElementById('cartItem');
const total = document.getElementById('total');

// utility: show / hide spinner
function showSpinner() {
  spinner.classList.remove('hidden');
}
function hideSpinner() {
  // keep spinner visible at least 300ms for UX
  setTimeout(() => spinner.classList.add('hidden'), 300);
}

// fetch categories
async function loadMenu() {
  showSpinner();
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    const menuList = data.categories;
    menuCategory(menuList);
  } catch (error) {
    console.log('something went wrong', error);
  } finally {
    hideSpinner();
  }
}

// menu category
const menuCategory = (menuList) => {
  menuUl.innerHTML = "";
  menuList.forEach(category => {
    const categoryName = category.category_name;
    menuUl.innerHTML += `
      <li id="${category.id}" class="menu-list-item hover:bg-[#15803D]"><a>${categoryName}</a></li>
    `;
  });
  setupMenuClicks();
}

// add click + active class toggle
function setupMenuClicks() {
  const menuListItems = document.querySelectorAll('.menu-list-item');
  menuListItems.forEach(el => {
    el.addEventListener('click', (e) => {
      menuListItems.forEach(item => item.classList.remove('active'));
      e.currentTarget.classList.add('active');

      let menuId = e.currentTarget.id;

      async function loadByCategory() {
        showSpinner();
        try {
          const res = await fetch(`https://openapi.programming-hero.com/api/category/${menuId}`);
          const data = await res.json();
          gridCardParent.innerHTML = '';
          const allPlants = data.plants;
          plants(allPlants);
        } catch (error) {
          console.log("Something went wrong:", error);
        } finally {
          hideSpinner();
        }
      }
      loadByCategory();
    });
  });
}

// get 🌴All Plants api
async function allPlants() {
  showSpinner();
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    const allPlants = data.plants;
    plants(allPlants);
  } catch (error) {
    console.log('something went wrong', error);
  } finally {
    hideSpinner();
  }
}

// plants function
const plants = (Plants) => {
  gridCardParent.innerHTML = ''
  Plants.forEach(plant => {
    gridCardParent.innerHTML += `
      <div class="card bg-base-100 shadow-sm flex flex-col">
        <figure class="h-48">
          <img src="${plant.image}" alt="${plant.name}" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body flex flex-col">
          <h2 class=" card-modal-button card-title text-start">${plant.name}</h2>
          <p class="text-sm flex-grow">${plant.description}</p>
          <div class="flex justify-between items-center w-full mt-auto">
            <button id ="${plant.id}" class="btn btn-sm btn-outline border-green-600 text-green-600 hover:bg-white ">${plant.category}</button>
            <span class="font-semibold text-lg text-green-600">৳${plant.price}</span>
          </div>
          <button class="btn rounded-full bg-[#15803D] text-white w-full mt-3">Add To Cart</button>
        </div>
      </div>
    `;
  });
  showCardDetails();
}

// show modal
function showCardDetails() {
  const cardModalButtons = document.querySelectorAll('.card-modal-button');
  cardModalButtons.forEach(el => {
    el.addEventListener('click', (e) => {
      let btnId = e.target.parentNode.querySelector('button').id;
      async function modalData() {
        showSpinner();
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
          hideSpinner();
        }
      }
      modalData();
    });
  });
}

// cart
cartDataShow.innerHTML = '';
function updateTotal() {
  let sum = 0;
  document.querySelectorAll('#cartItem .cart-item p').forEach(p => {
    let price = parseInt(p.innerText.replace(/[^\d]/g, ''), 10);
    sum += price;
  });
  total.innerText = 'Total: ৳' + sum;
}

gridCardParent.addEventListener('click', (e) => {
  if (e.target.innerText === 'Add To Cart') {
    const card = e.target.closest('.card');
    const title = card.querySelector('h2').innerText;
    const price = card.querySelector('span').innerText;

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
    updateTotal();
  }
});

// remove cart
cartDataShow.addEventListener('click', (e) => {
  if (e.target.closest('.remove-btn')) {
    const cartItem = e.target.closest('.cart-item');
    cartItem.remove();
    updateTotal();
  }
});

// init
loadMenu();
allPlants();
