// Coffee Shop Ordering System JavaScript

// Global Variables
let cart = [];
let menuData = {};
let currentCategory = 'coffee';
let orderCounter = 1000;

// Menu Data
const menuItems = {
    coffee: [
        {
            id: 1,
            name: "Espresso",
            description: "Rich and bold single shot of espresso",
            price: 3.50,
            icon: "☕"
        },
        {
            id: 2,
            name: "Americano",
            description: "Espresso shots with hot water",
            price: 4.00,
            icon: "☕"
        },
        {
            id: 3,
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: 4.50,
            icon: "☕"
        },
        {
            id: 4,
            name: "Latte",
            description: "Espresso with steamed milk and light foam",
            price: 5.00,
            icon: "☕"
        },
        {
            id: 5,
            name: "Mocha",
            description: "Espresso with chocolate and steamed milk",
            price: 5.50,
            icon: "☕"
        },
        {
            id: 6,
            name: "Caramel Macchiato",
            description: "Espresso with vanilla syrup, milk, and caramel",
            price: 6.00,
            icon: "☕"
        }
    ],
    tea: [
        {
            id: 7,
            name: "Earl Grey",
            description: "Classic bergamot-flavored black tea",
            price: 3.00,
            icon: "🫖"
        },
        {
            id: 8,
            name: "Green Tea",
            description: "Fresh and light green tea",
            price: 2.50,
            icon: "🍃"
        },
        {
            id: 9,
            name: "Chamomile",
            description: "Soothing herbal tea blend",
            price: 3.25,
            icon: "🌼"
        },
        {
            id: 10,
            name: "Chai Latte",
            description: "Spiced tea with steamed milk",
            price: 4.25,
            icon: "🫖"
        }
    ],
    pastries: [
        {
            id: 11,
            name: "Croissant",
            description: "Buttery and flaky French pastry",
            price: 3.75,
            icon: "🥐"
        },
        {
            id: 12,
            name: "Blueberry Muffin",
            description: "Fresh baked with wild blueberries",
            price: 4.25,
            icon: "🧁"
        },
        {
            id: 13,
            name: "Chocolate Chip Cookie",
            description: "Warm and gooey chocolate chip cookie",
            price: 2.50,
            icon: "🍪"
        },
        {
            id: 14,
            name: "Danish",
            description: "Sweet pastry with fruit filling",
            price: 4.00,
            icon: "🥮"
        }
    ],
    sandwiches: [
        {
            id: 15,
            name: "Turkey Club",
            description: "Turkey, bacon, lettuce, tomato on sourdough",
            price: 8.50,
            icon: "🥪"
        },
        {
            id: 16,
            name: "Veggie Wrap",
            description: "Hummus, vegetables, and greens in a tortilla",
            price: 7.25,
            icon: "🌯"
        },
        {
            id: 17,
            name: "Grilled Cheese",
            description: "Classic grilled cheese on artisan bread",
            price: 6.00,
            icon: "🥪"
        },
        {
            id: 18,
            name: "BLT",
            description: "Bacon, lettuce, and tomato on toasted bread",
            price: 7.75,
            icon: "🥪"
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    displayMenu(currentCategory);
    updateCartDisplay();
}

function setupEventListeners() {
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            switchCategory(category);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', openOrderModal);

    // Payment method buttons
    const paymentBtns = document.querySelectorAll('.payment-btn');
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectPaymentMethod(btn.dataset.method);
        });
    });

    // Modal close events
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('order-modal');
        const qrModal = document.getElementById('qr-modal');
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === qrModal) {
            closeQRModal();
        }
    });
}

function switchCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Display menu for selected category
    displayMenu(category);
}

function displayMenu(category) {
    const menuGrid = document.getElementById('menu-grid');
    const items = menuItems[category] || [];
    
    menuGrid.innerHTML = '';
    
    items.forEach(item => {
        const menuItemHTML = `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-item-image">
                    ${item.icon}
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="price">$${item.price.toFixed(2)}</span>
                        <button class="add-to-cart" onclick="addToCart(${item.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        menuGrid.innerHTML += menuItemHTML;
    });
}

function findMenuItem(id) {
    for (const category in menuItems) {
        const item = menuItems[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

function addToCart(itemId) {
    const item = findMenuItem(itemId);
    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    animateCartButton();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Update checkout button
    checkoutBtn.disabled = cart.length === 0;
    
    // Display cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

function animateCartButton() {
    const cartLink = document.querySelector('a[href="#cart"]');
    cartLink.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartLink.style.transform = 'scale(1)';
    }, 200);
}

function openOrderModal() {
    if (cart.length === 0) return;
    
    const modal = document.getElementById('order-modal');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    // Populate order summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = total.toFixed(2);
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
}

function placeOrder() {
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    
    // Validate required fields
    if (!customerName || !customerPhone || !pickupTime) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Generate order number
    const orderNumber = `ORD-${orderCounter++}`;
    
    // Create order object
    const order = {
        orderNumber,
        customerName,
        customerPhone,
        pickupTime,
        specialInstructions,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage (in a real app, this would go to a server)
    saveOrder(order);
    
    // Show QR code modal
    showQRCode(order);
    
    // Clear cart and close modal
    cart = [];
    updateCartDisplay();
    closeModal();
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('coffeeShopOrders') || '[]');
    orders.push(order);
    localStorage.setItem('coffeeShopOrders', JSON.stringify(orders));
}

function showQRCode(order) {
    const qrModal = document.getElementById('qr-modal');
    const orderNumberSpan = document.getElementById('order-number');
    const qrCodeDiv = document.getElementById('qr-code');
    const pickupTimeSpan = document.getElementById('pickup-time-display');
    
    // Set order details
    orderNumberSpan.textContent = order.orderNumber;
    
    // Calculate pickup time
    const now = new Date();
    const pickupDateTime = new Date(now.getTime() + (parseInt(order.pickupTime) * 60000));
    pickupTimeSpan.textContent = pickupDateTime.toLocaleTimeString();
    
    // Clear previous QR code
    qrCodeDiv.innerHTML = '';
    
    // Generate QR code data
    const qrData = JSON.stringify({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: order.total.toFixed(2),
        pickupTime: pickupDateTime.toISOString(),
        items: order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
    });
    
    // Generate QR code
    QRCode.toCanvas(qrCodeDiv, qrData, {
        width: 200,
        height: 200,
        colorDark: '#8B4513',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
    }, function (error) {
        if (error) {
            console.error('QR Code generation failed:', error);
            qrCodeDiv.innerHTML = '<p>QR Code generation failed</p>';
        }
    });
    
    // Show modal
    qrModal.style.display = 'block';
}

function closeQRModal() {
    document.getElementById('qr-modal').style.display = 'none';
}

function downloadQR() {
    const canvas = document.querySelector('#qr-code canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'order-qr-code.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

function newOrder() {
    closeQRModal();
    // Reset form
    document.getElementById('customer-form').reset();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Utility function to get orders (for potential admin panel)
function getOrders() {
    return JSON.parse(localStorage.getItem('coffeeShopOrders') || '[]');
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateQuantity,
        placeOrder,
        getOrders
    };
}