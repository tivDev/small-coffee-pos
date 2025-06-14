// Initialize localStorage data if not exists
function initializeLocalStorage() {
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            { id: 1, name: "Espresso", category: "Coffee", price: 2.50, stock: 100 },
            { id: 2, name: "Cappuccino", category: "Coffee", price: 3.50, stock: 80 },
            { id: 3, name: "Latte", category: "Coffee", price: 3.75, stock: 75 },
            { id: 4, name: "Americano", category: "Coffee", price: 2.75, stock: 90 },
            { id: 5, name: "Mocha", category: "Coffee", price: 4.00, stock: 60 },
            { id: 6, name: "Green Tea", category: "Tea", price: 2.50, stock: 50 },
            { id: 7, name: "Black Tea", category: "Tea", price: 2.25, stock: 55 },
            { id: 8, name: "Croissant", category: "Food", price: 2.75, stock: 40 },
            { id: 9, name: "Muffin", category: "Food", price: 2.50, stock: 35 }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    if (!localStorage.getItem('categories')) {
        const defaultCategories = ["Coffee", "Tea", "Food", "Specialty"];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('discounts')) {
        const defaultDiscounts = [
            { category: "Coffee", discount: 0.1, active: true },
            { category: "Tea", discount: 0.15, active: true }
        ];
        localStorage.setItem('discounts', JSON.stringify(defaultDiscounts));
    }

  if (!localStorage.getItem('transactions')) {
        const today = new Date();
        const dates = [];
        
        // Generate dates for the last 5 days
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        const defaultTransactions = [
            { id: 1, date: dates[0], time: "10:00", items: ["Espresso", "Croissant"], total: 5.25, status: "completed" },
            { id: 2, date: dates[1], time: "11:00", items: ["Cappuccino"], total: 3.50, status: "completed" },
            { id: 3, date: dates[2], time: "12:00", items: ["Latte", "Muffin"], total: 6.25, status: "completed" },
            { id: 4, date: dates[3], time: "13:00", items: ["Americano", "Green Tea"], total: 5.25, status: "completed" },
            { id: 5, date: dates[4], time: "14:00", items: ["Mocha"], total: 4.00, status: "completed" }
        ];
        localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
    }
    
}

// Helper functions
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

function getDiscounts() {
    return JSON.parse(localStorage.getItem('discounts')) || [];
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function saveDiscounts(discounts) {
    localStorage.setItem('discounts', JSON.stringify(discounts));
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    
    // Load the appropriate script based on the current page
    const path = window.location.pathname.split('/').pop();
    
    switch(path) {
        case 'index.html':
        case '':
            // Load dashboard scripts
            if (typeof initDashboard === 'function') {
                initDashboard();
            }
            break;
        case 'products.html':
            // Load products scripts
            if (typeof initProducts === 'function') {
                initProducts();
            }
            break;
        case 'categories.html':
            // Load categories scripts
            if (typeof initCategories === 'function') {
                initCategories();
            }
            break;
        case 'discounts.html':
            // Load discounts scripts
            if (typeof initDiscounts === 'function') {
                initDiscounts();
            }
            break;
        case 'sales.html':
            // Load sales scripts
            if (typeof initSales === 'function') {
                initSales();
            }
            break;
    }
});