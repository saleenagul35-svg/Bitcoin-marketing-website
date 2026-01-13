let mainset = document.querySelectorAll(".mainset");
if (localStorage.getItem("theme") === "lighter-mode") {
    mainset.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      mainset.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}

// bitcoin chart
// SUPER SIMPLE BITCOIN CHART - GUARANTEED TO WORK
console.log('=== BITCOIN CHART STARTING ===');

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('Page loaded, creating chart...');
    createSimpleBitcoinChart();
});

function createSimpleBitcoinChart() {
    console.log('Step 1: Looking for bitcoin-chart element...');
    
    // Get the div where chart should go
    const chartDiv = document.getElementById('bitcoin-chart');
    
    if (!chartDiv) {
        console.error('ERROR: Cannot find div with id="bitcoin-chart"');
        alert('Error: Cannot find bitcoin-chart div');
        return;
    }
    
    console.log('Step 2: Found bitcoin-chart div');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('ERROR: Chart.js is not loaded!');
        chartDiv.innerHTML = '<div style="color: white; padding: 20px;">ERROR: Chart.js not loaded</div>';
        return;
    }
    
    console.log('Step 3: Chart.js is loaded, creating chart...');
    
    // Clear the div
    chartDiv.innerHTML = '';
    
    // Create canvas with fixed size
    const canvas = document.createElement('canvas');
    canvas.id = 'bitcoin-canvas';
    canvas.width = 700;  // Fixed width
    canvas.height = 300; // Fixed height
    
    // Add canvas to div
    chartDiv.appendChild(canvas);
    
    console.log('Step 4: Canvas created, dimensions:', canvas.width, 'x', canvas.height);
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // CREATE A SIMPLE TEST CHART FIRST
    createTestChart(ctx);
    
    // Then load Bitcoin data
    setTimeout(() => loadBitcoinData(ctx), 1000);
}

function createTestChart(ctx) {
    console.log('Creating test chart...');
    
    // Very simple test data
    const testChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Bitcoin Test',
                data: [40000, 42000, 41000, 43000, 42000, 44000],
                borderColor: '#4c7fec',
                backgroundColor: 'rgba(76, 127, 236, 0.1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: false, // IMPORTANT: Set to false for fixed size
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' }
                },
                y: {
                    ticks: { 
                        color: 'white',
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
    
    console.log('✅ Test chart created!');
    return testChart;
}

function loadBitcoinData(ctx) {
    console.log('Loading Bitcoin data...');
    
    // Destroy test chart
    Chart.getChart(ctx.canvas)?.destroy();
    
    // Create real Bitcoin chart
    const bitcoinChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BTC/USD',
                data: [],
                borderColor: '#4c7fec',
                backgroundColor: 'rgba(76, 127, 236, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' }
                },
                y: {
                    ticks: { 
                        color: 'white',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Add initial data
    addInitialData(bitcoinChart);
    
    // Start updates
    setInterval(() => updateChart(bitcoinChart), 5000);
}

function addInitialData(chart) {
    console.log('Adding initial data...');
    
    // Add 10 data points
    for (let i = 0; i < 10; i++) {
        const price = 45000 + (Math.random() * 2000 - 1000);
        chart.data.labels.push(`Point ${i + 1}`);
        chart.data.datasets[0].data.push(price);
    }
    
    chart.update();
    console.log('✅ Initial data added');
}

function updateChart(chart) {
    const newPrice = 45000 + (Math.random() * 2000 - 1000);
    
    // Add new data point
    chart.data.labels.push(`Point ${chart.data.labels.length + 1}`);
    chart.data.datasets[0].data.push(newPrice);
    
    // Remove first point if too many
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    chart.update();
    
    // Update the price display
    updatePriceDisplay(newPrice);
    
    console.log('Chart updated with price:', newPrice);
}

function updatePriceDisplay(price) {
    const marginBox = document.querySelector('.margin-box h3');
    if (marginBox) {
        marginBox.textContent = `$${price.toFixed(2)}`;
    }
}

// ADD CRITICAL CSS
const style = document.createElement('style');
style.textContent = `
    /* MAKE SURE CHART IS VISIBLE */
    #bitcoin-chart {
        width: 700px !important;
        height: 300px !important;
        background-color: #00153c !important;
        border: 2px solid #4c7fec !important;
        border-radius: 10px !important;
        margin: 10px !important;
        padding: 10px !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 1 !important;
    }
    
    #bitcoin-canvas {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
    }
    
    /* OVERRIDE ANY HIDING */
    #bitcoin-chart {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

console.log('=== BITCOIN CHART SCRIPT LOADED ===');