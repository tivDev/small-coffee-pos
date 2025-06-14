let cart = [];

function initSales() {
    renderProductsGrid();
    renderCart();
    setupEventListeners();
}

function renderProductsGrid() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    const productsGrid = document.getElementById('products-grid');
    
    productsGrid.innerHTML = '';
    
    // Create category tabs
    const categoryTabs = document.createElement('div');
    categoryTabs.className = 'category-tabs';
    
    // Add "All" tab
    const allTab = document.createElement('button');
    allTab.className = 'category-tab active';
    allTab.textContent = 'All';
    allTab.dataset.category = 'all';
    categoryTabs.appendChild(allTab);
    
    // Add category tabs
    categories.forEach(category => {
        if (category) { // Skip empty categories
            const tab = document.createElement('button');
            tab.className = 'category-tab';
            tab.textContent = category;
            tab.dataset.category = category;
            categoryTabs.appendChild(tab);
        }
    });
    
    productsGrid.appendChild(categoryTabs);
    
    // Add products
    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-container';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        productCard.innerHTML = `
            <i class="fas fa-mug-hot product-icon"></i>
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
        `;
        
        productCard.addEventListener('click', () => addToCart(product));
        productsContainer.appendChild(productCard);
    });
    
    productsGrid.appendChild(productsContainer);
    
    // Add event listeners for category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartDiscount = document.getElementById('cart-discount');
    
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    let discountAmount = 0;
    
    cart.forEach(item => {
        const product = getProducts().find(p => p.id === item.id);
        const discounts = getDiscounts();
        const categoryDiscount = discounts.find(d => d.category === product.category && d.active);
        
        let itemPrice = product.price * item.quantity;
        let itemDiscount = 0;
        
        if (categoryDiscount) {
            itemDiscount = itemPrice * categoryDiscount.discount;
            itemPrice -= itemDiscount;
        }
        
        subtotal += product.price * item.quantity;
        discountAmount += itemDiscount;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                ${categoryDiscount ? `<span class="discount-badge">-${(categoryDiscount.discount * 100).toFixed(0)}%</span>` : ''}
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-id="${product.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
                <button class="increase-quantity" data-id="${product.id}">+</button>
            </div>
            <div class="cart-item-price">
                $${itemPrice.toFixed(2)}
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    const taxRate = 0.08; // 8% tax
    const tax = (subtotal - discountAmount) * taxRate;
    const total = (subtotal - discountAmount) + tax;
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
    // Quantity changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('increase-quantity')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, 1);
        } else if (e.target.classList.contains('decrease-quantity')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, -1);
        } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('.cart-item-quantity input')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                updateCartItem(productId, newQuantity);
            } else {
                removeFromCart(productId);
            }
        }
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }
    
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
}

function updateCartItem(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const transactions = getTransactions();
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    
    const products = getProducts();
    const items = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return product.name;
    });
    
    // Calculate totals with discounts
    let subtotal = 0;
    let discountAmount = 0;
    const discounts = getDiscounts();
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const categoryDiscount = discounts.find(d => d.category === product.category && d.active);
        
        let itemPrice = product.price * item.quantity;
        
        if (categoryDiscount) {
            const itemDiscount = itemPrice * categoryDiscount.discount;
            itemPrice -= itemDiscount;
            discountAmount += itemDiscount;
        }
        
        subtotal += itemPrice;
    });
    
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Add transaction with all details
    transactions.push({
        id: newId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discountAmount.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        status: 'completed'
    });
    
    // Update product stock
    cart.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
            products[productIndex].stock -= item.quantity;
        }
    });
    
    // Save data
    saveTransactions(transactions);
    saveProducts(products);
    
    // Clear cart and show success message
    cart = [];
    renderCart();
    
    alert(`Checkout successful! Total: $${total.toFixed(2)}`);
}