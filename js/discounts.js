function initDiscounts() {
    renderDiscountsTable();
    setupDiscountForm();
}

function renderDiscountsTable() {
    const discounts = getDiscounts();
    const categories = getCategories();
    const tableBody = document.querySelector('#discounts-table tbody');
    
    tableBody.innerHTML = '';
    
    discounts.forEach((discount, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${discount.category}</td>
            <td>${(discount.discount * 100).toFixed(0)}%</td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-discount" type="checkbox" 
                        data-category="${discount.category}" 
                        ${discount.active ? 'checked' : ''}>
                </div>
            </td>
            <td class="action-btns">
                <button class="btn btn-sm btn-danger delete-discount" data-category="${discount.category}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners for toggle and delete buttons
    document.querySelectorAll('.toggle-discount').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.getAttribute('data-category');
            toggleDiscountActive(category, this.checked);
        });
    });
    
    document.querySelectorAll('.delete-discount').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            deleteDiscount(category);
        });
    });
}

function setupDiscountForm() {
    const form = document.getElementById('discount-form');
    const categorySelect = document.getElementById('discount-category');
    const categories = getCategories();
    
    // Populate category select
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('discount-category').value;
        const discount = parseFloat(document.getElementById('discount-value').value) / 100;
        
        if (category && !isNaN(discount)) {
            const discounts = getDiscounts();
            
            // Check if discount already exists for this category
            const existingIndex = discounts.findIndex(d => d.category === category);
            
            if (existingIndex !== -1) {
                discounts[existingIndex] = { category, discount, active: true };
            } else {
                discounts.push({ category, discount, active: true });
            }
            
            saveDiscounts(discounts);
            renderDiscountsTable();
            form.reset();
        }
    });
}

function toggleDiscountActive(category, active) {
    const discounts = getDiscounts();
    const discount = discounts.find(d => d.category === category);
    
    if (discount) {
        discount.active = active;
        saveDiscounts(discounts);
    }
}

function deleteDiscount(category) {
    if (confirm(`Are you sure you want to remove the discount for ${category}?`)) {
        const discounts = getDiscounts();
        const filteredDiscounts = discounts.filter(d => d.category !== category);
        saveDiscounts(filteredDiscounts);
        renderDiscountsTable();
    }
}