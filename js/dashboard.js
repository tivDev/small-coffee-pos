function initDashboard() {
    updateDashboardCards();
    renderSalesChart();
    renderTopProductsChart();
    renderRecentTransactions();
}

function updateDashboardCards() {
    const products = getProducts();
    const categories = getCategories();
    const transactions = getTransactions();
    
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = transactions
        .filter(t => t.date === today)
        .reduce((sum, t) => sum + t.total, 0);
    
    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = transactions
        .filter(t => {
            const date = new Date(t.date);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.total, 0);
    
    // Update the cards
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-categories').textContent = categories.length;
    document.getElementById('today-sales').textContent = `$${todaySales.toFixed(2)}`;
    document.getElementById('monthly-revenue').textContent = `$${monthlyRevenue.toFixed(2)}`;
}

function renderSalesChart() {
    const transactions = getTransactions();
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Group transactions by day for the last 7 days
    const dates = [];
    const salesData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        dates.push(dateStr);
        
        const daySales = transactions
            .filter(t => t.date === dateStr)
            .reduce((sum, t) => sum + t.total, 0);
            
        salesData.push(daySales);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
                label: 'Daily Sales ($)',
                data: salesData,
                backgroundColor: 'rgba(111, 78, 55, 0.2)',
                borderColor: 'rgba(111, 78, 55, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderTopProductsChart() {
    const transactions = getTransactions();
    const products = getProducts();
    
    // Count product sales
    const productSales = {};
    
    transactions.forEach(t => {
        t.items.forEach(item => {
            if (!productSales[item]) {
                productSales[item] = 0;
            }
            productSales[item]++;
        });
    });
    
    // Sort products by sales count
    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const productNames = sortedProducts.map(p => p[0]);
    const salesCounts = sortedProducts.map(p => p[1]);
    
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Number of Sales',
                data: salesCounts,
                backgroundColor: [
                    'rgba(111, 78, 55, 0.7)',
                    'rgba(196, 164, 132, 0.7)',
                    'rgba(139, 69, 19, 0.7)',
                    'rgba(101, 67, 33, 0.7)',
                    'rgba(150, 75, 0, 0.7)'
                ],
                borderColor: [
                    'rgba(111, 78, 55, 1)',
                    'rgba(196, 164, 132, 1)',
                    'rgba(139, 69, 19, 1)',
                    'rgba(101, 67, 33, 1)',
                    'rgba(150, 75, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderRecentTransactions() {
    const transactions = getTransactions().slice(-5).reverse();
    console.log('transactions: ', transactions);
    const tbody = document.querySelector('#recent-transactions tbody');
    tbody.innerHTML = '';
    
    transactions.forEach(t => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${t.id}</td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.time}</td>
            <td>${t.items.join(', ')}</td>
            <td>$${t.total.toFixed(2)}</td>
            <td><span class="status ${t.status}">${t.status}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}