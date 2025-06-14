function initCategories() {
    renderCategoriesTable();
    setupCategoryForm();
}

function renderCategoriesTable() {
    const categories = getCategories();
    const tableBody = document.querySelector('#categories-table tbody');
    
    tableBody.innerHTML = '';
    
    categories.forEach((category, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${category}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-primary edit-category" data-category="${category}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-category" data-category="${category}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-category').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            editCategory(category);
        });
    });
    
    document.querySelectorAll('.delete-category').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            deleteCategory(category);
        });
    });
}

function setupCategoryForm() {
    const form = document.getElementById('category-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const categoryName = document.getElementById('category-name').value.trim();
        
        if (categoryName) {
            const categories = getCategories();
            
            if (!categories.includes(categoryName)) {
                categories.push(categoryName);
                saveCategories(categories);
                renderCategoriesTable();
                form.reset();
            } else {
                alert('Category already exists!');
            }
        }
    });
}

function editCategory(oldName) {
    const newName = prompt('Enter new category name:', oldName);
    
    if (newName && newName !== oldName) {
        const categories = getCategories();
        const index = categories.indexOf(oldName);
        
        if (index !== -1) {
            categories[index] = newName;
            saveCategories(categories);
            
            // Update products with this category
            const products = getProducts();
            products.forEach(product => {
                if (product.category === oldName) {
                    product.category = newName;
                }
            });
            saveProducts(products);
            
            // Update discounts with this category
            const discounts = getDiscounts();
            discounts.forEach(discount => {
                if (discount.category === oldName) {
                    discount.category = newName;
                }
            });
            saveDiscounts(discounts);
            
            renderCategoriesTable();
        }
    }
}

function deleteCategory(category) {
    if (confirm(`Are you sure you want to delete the "${category}" category? This will also remove it from all products.`)) {
        const categories = getCategories();
        const filteredCategories = categories.filter(c => c !== category);
        saveCategories(filteredCategories);
        
        // Remove category from products (set to empty string)
        const products = getProducts();
        products.forEach(product => {
            if (product.category === category) {
                product.category = '';
            }
        });
        saveProducts(products);
        
        // Remove discounts for this category
        const discounts = getDiscounts();
        const filteredDiscounts = discounts.filter(d => d.category !== category);
        saveDiscounts(filteredDiscounts);
        
        renderCategoriesTable();
    }
}