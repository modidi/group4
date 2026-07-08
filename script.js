//currency in KSH
//Product Data
//Stores all perfume information
const perfumes = [
  {
    id: 1,
    name: "Rose Elegance",
    category: "Floral",
    price: 5850,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
  },
  {
    id: 2,
    name: "Midnight Oud",
    category: "Woody",
    price: 9100,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
  },
  {
    id: 3,
    name: "Citrus Bloom",
    category: "Citrus",
    price: 5200,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500",
  },
  {
    id: 4,
    name: "Golden Amber",
    category: "Oriental",
    price: 11050,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500",
  },
  {
    id: 5,
    name: "Lavender Dream",
    category: "Floral",
    price: 7150,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500",
  },
  {
    id: 6,
    name: "Forest Musk",
    category: "Woody",
    price: 8840,
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=500",
  },
  {
    id: 7,
    name: "Lemon Splash",
    category: "Citrus",
    price: 6240,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500",
  },
  {
    id: 8,
    name: "Royal Spice",
    category: "Oriental",
    price: 12350,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500",
  },
];

// A safe local fallback used only if an image ever fails to load
const FALLBACK_IMAGE = "https://placehold.co/500x500?text=Aura+Essence";

// Helper: formats a number as "KSh 5,850"
function formatKES(amount) {
  return "KSh " + amount.toLocaleString("en-KE");
}


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
            <img src="${product.image}" alt="{product.name || FALLBACK_IMAGE}" onerror="this.src='${FALLBACK_IMAGE}'" /> 
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="price">${formatKES(product.price)}</div>
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
                <button onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>

            <div>
                <strong>${formatKES(item.price * item.quantity)}</strong>
                <br>
                <button onclick="removeItem(${item.id})">
                    Remove
                </button>
            </div>
        `;

    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = formatKES(total);
}

// Increase the quantity of a product in the cart
function increaseQuantity(id) {
  const item = cartData.find(product => product.id === id);

  if (item) {
    item.quantity++;
  }

  updateCart();
}

// Decrease the quantity of a product in the cart
function decreaseQuantity(id) {
  const item = cartData.find(product => product.id === id);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeItem(id);
    return;
  }

  updateCart();
}

//Removes an item from the shopping cart
function removeItem(id) {
  cartData = cartData.filter((item) => item.id !== id);

  updateCart();
}

window.removeItem = removeItem;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

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
const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();

  // Check if the cart is empty
  if (cartData.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  //   Validate the email field
  if (email === "") {
    alert("Please enter your email address.");
    return;
  }

//   Display a success mesage
  alert("Thank you for shopping with Aura Essence!");

//   Clear the cart
  cartData = [];
  updateCart();

  // Reset the checkout form
  checkoutForm.reset()

  // Close the cart
  cart.classList.remove("open");
  overlay.classList.remove("open");
});

// Initialize
//Displays products and loads the shopping cart
displayProducts(perfumes);
updateCart();


