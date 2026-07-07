//Product Data
//Stores all perfume information
const perfumes = [
  {
    id: 1,
    name: "Rose Elegance",
    category: "Floral",
    price: 45,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
  },
  {
    id: 2,
    name: "Midnight Oud",
    category: "Woody",
    price: 70,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
  },
  {
    id: 3,
    name: "Citrus Bloom",
    category: "Citrus",
    price: 40,
    image: "https://images.unsplash.com/photo-1615634262417-d9e7d66d4d5c?w=500",
  },
  {
    id: 4,
    name: "Golden Amber",
    category: "Oriental",
    price: 85,
    image: "https://images.unsplash.com/photo-1595425964072-6a2f4c6d0d9e?w=500",
  },
  {
    id: 5,
    name: "Lavender Dream",
    category: "Floral",
    price: 55,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500",
  },
  {
    id: 6,
    name: "Forest Musk",
    category: "Woody",
    price: 68,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=500",
  },
  {
    id: 7,
    name: "Lemon Splash",
    category: "Citrus",
    price: 48,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500",
  },
  {
    id: 8,
    name: "Royal Spice",
    category: "Oriental",
    price: 95,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500",
  },
];

// DOM Elements
//Selects elements from the HTML page
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const cart = document.getElementById("cartPanel");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartSubtotal");

//Variables
//Used to track the selected category and shopping cart
let currentCategory = "all";
let cartData = [];

// Display Products
//Displays Products on the webpage
function displayProducts(products) {
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = "<h2>No perfumes found.</h2>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="price">$${product.price}</div>
                <button class="add-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

    productGrid.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}


// Search + Filter
//Filters products based on search tecxt and catergory
function filterProducts() {
  const search = searchInput.value.toLowerCase();

  const filtered = perfumes.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);

    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentCategory = button.dataset.category;

    filterProducts();
  });
});


// Shopping Cart functions
// Adds, updates and removes cart items

//Add a product to the shopping cart
function addToCart(e) {
  const id = Number(e.target.dataset.id);

  const product = perfumes.find((item) => item.id === id);

  const existing = cartData.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cartData.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
}

//Updates the shopping cart display
function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cartData.forEach((item) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                Qty: ${item.quantity}
            </div>

            <div>
                $${item.price * item.quantity}
                <br>
                <button onclick="removeItem(${item.id})">
                    Remove
                </button>
            </div>
        `;

    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = total.toFixed(2);
}

//Removes an item from the shopping cart
function removeItem(id) {
  cartData = cartData.filter((item) => item.id !== id);

  updateCart();
}

window.removeItem = removeItem;


// Toggle Shopping Cart
//Opens and closes the cart
cartToggleBtn.addEventListener("click", () => {
  cart.classList.toggle("open");
  overlay.classList.toggle("open");
});

cartCloseBtn.addEventListener("click", () => {
    cart.classList.remove("open");
    overlay.classList.remove("open");
})

overlay.addEventListener("click", () => {
    cart.classList.remove("open");
    overlay.classList.remove("open");
})

// Checkout
//Clears the cart after purchase
const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    alert("Your cart is empty.");

    return;
  }

  alert("Thank you for shopping with Aura Essence!");

  cartData = [];

  updateCart();

  cart.classList.remove("open");
  overlay.classList.remove("open");
});


// Initialize
//Displays products and loads the shopping cart
displayProducts(perfumes);
updateCart();
