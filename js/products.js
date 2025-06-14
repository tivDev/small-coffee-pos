function initProducts() {
    renderProductsTable();
    setupProductForm();
}

function renderProductsTable() {
    const products = getProducts();
    const categories = getCategories();
    const tableBody = document.querySelector('#products-table tbody');
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

function setupProductForm() {
    const form = document.getElementById('product-form');
    const categories = getCategories();
    const categorySelect = document.getElementById('product-category');
    
    // Populate category select
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Add new category option
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = 'new';
    newCategoryOption.textContent = '+ Add New Category';
    categorySelect.appendChild(newCategoryOption);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        
        if (category === 'new') {
            const newCategory = prompt('Enter new category name:');
            if (newCategory) {
                // Add new category
                const categories = getCategories();
                if (!categories.includes(newCategory)) {
                    categories.push(newCategory);
                    saveCategories(categories);
                }
                
                // Update the select
                const categorySelect = document.getElementById('product-category');
                const newOption = document.createElement('option');
                newOption.value = newCategory;
                newOption.textContent = newCategory;
                categorySelect.insertBefore(newOption, categorySelect.lastChild);
                categorySelect.value = newCategory;
            } else {
                return;
            }
        }
        
        const products = getProducts();
        
        if (productId) {
            // Edit existing product
            const index = products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                products[index] = { 
                    id: parseInt(productId), 
                    name, 
                    category, 
                    price, 
                    stock 
                };
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ 
                id: newId, 
                name, 
                category, 
                price, 
                stock 
            });
        }
        
        saveProducts(products);
        renderProductsTable();
        form.reset();
        document.getElementById('product-id').value = '';
    });
}

function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        
        // Scroll to form
        document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        saveProducts(filteredProducts);
        renderProductsTable();
    }
}