function initTransactions() {
    renderTransactionsTable();
    setupFilter();
}

function renderTransactionsTable(transactions = null) {
    const transactionsToDisplay = transactions || getTransactions();
    const tableBody = document.querySelector('#transactions-table tbody');
    
    tableBody.innerHTML = '';
    
    transactionsToDisplay.forEach(transaction => {
        const tr = document.createElement('tr');
        
        // Calculate discount amount if not stored
        const discount = transaction.discount || 0;
        const tax = transaction.tax || (transaction.total - (transaction.total / 1.08)).toFixed(2);
        const subtotal = transaction.subtotal || (transaction.total - tax).toFixed(2);
        
        const date = new Date(transaction.date);
        const timeString = transaction.time || date.toLocaleTimeString();
        
        tr.innerHTML = `
            <td>${transaction.id}</td>
            <td>${date.toLocaleDateString()}</td>
            <td>${timeString}</td>
            <td>${transaction.items.join(', ')}</td>
            <td>$${parseFloat(subtotal).toFixed(2)}</td>
            <td>$${parseFloat(discount).toFixed(2)}</td>
            <td>$${parseFloat(tax).toFixed(2)}</td>
            <td>$${transaction.total.toFixed(2)}</td>
            <td><span class="status ${transaction.status}">${transaction.status}</span></td>
        `;
        
        tableBody.appendChild(tr);
    });
}

function setupFilter() {
    const dateFilter = document.getElementById('date-filter');
    const resetFilter = document.getElementById('reset-filter');
    
    dateFilter.addEventListener('change', function() {
        if (this.value) {
            const filteredTransactions = getTransactions().filter(t => t.date === this.value);
            renderTransactionsTable(filteredTransactions);
        }
    });
    
    resetFilter.addEventListener('click', function() {
        dateFilter.value = '';
        renderTransactionsTable();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initTransactions === 'function') {
        initTransactions();
    }
});