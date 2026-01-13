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
// Bitcoin Live Chart - Working Version
// Include this after Chart.js in your HTML

class BitcoinChart {
    constructor(options = {}) {
        // Default options
        this.options = {
            elementId: 'bitcoin-chart',
            currency: 'USD',
            updateInterval: 10000, // 10 seconds
            maxDataPoints: 30,
            chartType: 'line',
            apiProvider: 'coingecko', // 'coingecko' or 'binance'
            ...options
        };
        
        console.log('BitcoinChart: Initializing with elementId:', this.options.elementId);
        
        // Find the canvas element
        this.canvas = document.getElementById(this.options.elementId);
        
        if (!this.canvas) {
            console.error(`❌ ERROR: Cannot find element with id="${this.options.elementId}"`);
            console.log('Available elements with "chart" in ID:');
            document.querySelectorAll('[id*="chart"]').forEach(el => {
                console.log(`- ${el.id}`);
            });
            return;
        }
        
        console.log('✅ Found canvas element:', this.canvas);
        
        // Set canvas size if not already set
        if (!this.canvas.style.width || !this.canvas.style.height) {
            this.canvas.style.width = '100%';
            this.canvas.style.height = '400px';
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
        this.priceData = [];
        this.timeData = [];
        this.updateInterval = null;
        
        // Initialize
        this.initializeChart();
        this.startUpdates();
    }
    
    initializeChart() {
        console.log('Initializing chart...');
        
        // Clear any existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create gradient for background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(247, 147, 26, 0.3)');
        gradient.addColorStop(1, 'rgba(247, 147, 26, 0.05)');
        
        // Chart configuration
        const config = {
            type: 'line',
            data: {
                labels: this.timeData,
                datasets: [{
                    label: `BTC/${this.options.currency}`,
                    data: this.priceData,
                    borderColor: '#f7931a',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0 // Disable animations for real-time updates
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second',
                            displayFormats: {
                                second: 'HH:mm:ss'
                            }
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        };
        
        // Create the chart
        this.chart = new Chart(this.ctx, config);
        console.log('✅ Chart initialized successfully');
        
        // Add initial dummy data so chart shows something
        this.addInitialData();
    }
    
    addInitialData() {
        console.log('Adding initial data...');
        const now = new Date();
        const basePrice = 45000;
        
        // Add 10 initial data points
        for (let i = 10; i > 0; i--) {
            const time = new Date(now.getTime() - i * 2000); // 2 second intervals
            const price = basePrice + (Math.random() - 0.5) * 1000;
            
            this.timeData.push(time);
            this.priceData.push(price);
        }
        
        // Update chart
        this.updateChart();
    }
    
    async startUpdates() {
        console.log('Starting price updates...');
        
        // Initial update
        await this.updatePrice();
        
        // Set up interval for updates
        this.updateInterval = setInterval(() => {
            this.updatePrice();
        }, this.options.updateInterval);
    }
    
    async updatePrice() {
        try {
            let price;
            
            if (this.options.apiProvider === 'coingecko') {
                price = await this.fetchFromCoinGecko();
            } else {
                price = await this.fetchFromBinance();
            }
            
            if (price) {
                this.addDataPoint(price);
            }
            
        } catch (error) {
            console.error('Failed to fetch price:', error);
            // Add a mock data point if API fails
            this.addMockDataPoint();
        }
    }
    
    async fetchFromCoinGecko() {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`CoinGecko API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.bitcoin.usd;
            
        } catch (error) {
            console.error('CoinGecko fetch failed:', error);
            // Try Binance as fallback
            return await this.fetchFromBinance();
        }
    }
    
    async fetchFromBinance() {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            
            if (!response.ok) {
                throw new Error(`Binance API error: ${response.status}`);
            }
            
            const data = await response.json();
            return parseFloat(data.price);
            
        } catch (error) {
            console.error('Binance fetch failed:', error);
            return null;
        }
    }
    
    addDataPoint(price) {
        const now = new Date();
        
        // Add new data point
        this.timeData.push(now);
        this.priceData.push(price);
        
        // Remove oldest data point if we exceed maximum
        if (this.timeData.length > this.options.maxDataPoints) {
            this.timeData.shift();
            this.priceData.shift();
        }
        
        // Update the chart
        this.updateChart();
        
        // Log update
        console.log(`📈 Price updated: $${price.toLocaleString()} at ${now.toLocaleTimeString()}`);
    }
    
    addMockDataPoint() {
        const lastPrice = this.priceData.length > 0 ? 
            this.priceData[this.priceData.length - 1] : 45000;
        
        // Generate small random change
        const changePercent = (Math.random() - 0.5) * 0.002; // ±0.1%
        const newPrice = lastPrice * (1 + changePercent);
        
        this.addDataPoint(newPrice);
    }
    
    updateChart() {
        if (!this.chart) return;
        
        // Update chart data
        this.chart.data.labels = this.timeData;
        this.chart.data.datasets[0].data = this.priceData;
        
        // Update chart
        this.chart.update('none');
    }
    
    // Public method to manually update
    refresh() {
        this.updatePrice();
    }
    
    // Clean up
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.chart) {
            this.chart.destroy();
        }
        console.log('BitcoinChart destroyed');
    }
}

// ============================================
// AUTO-INITIALIZATION CODE
// ============================================

// Wait for both DOM and Chart.js to be ready
function initializeBitcoinChart() {
    console.log('Checking for bitcoin-chart element...');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded!');
        console.log('Please add this to your HTML:');
        console.log('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        
        // Show error message on the page
        const chartElement = document.getElementById('bitcoin-chart');
        if (chartElement && chartElement.parentNode) {
            chartElement.parentNode.innerHTML = `
                <div style="color: red; padding: 20px; border: 2px solid red; border-radius: 5px;">
                    <strong>Error:</strong> Chart.js library not loaded.<br>
                    Please add: &lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;
                </div>
            `;
        }
        return;
    }
    
    // Look for chart element
    const chartElement = document.getElementById('bitcoin-chart');
    
    if (chartElement) {
        console.log('✅ Found bitcoin-chart element, initializing...');
        
        // Create a global instance
        window.bitcoinLiveChart = new BitcoinChart({
            elementId: 'bitcoin-chart',
            updateInterval: 5000, // 5 seconds
            maxDataPoints: 20
        });
        
        // Make it accessible via a global function
        window.updateBitcoinChart = function() {
            if (window.bitcoinLiveChart) {
                window.bitcoinLiveChart.refresh();
            }
        };
        
    } else {
        console.warn('⚠️ bitcoin-chart element not found on page');
        console.log('Make sure you have this in your HTML:');
        console.log('<canvas id="bitcoin-chart"></canvas>');
        
        // Alternative: Create the element automatically
        createChartElementAutomatically();
    }
}

// Function to create chart element if it doesn't exist
function createChartElementAutomatically() {
    console.log('Attempting to create chart element automatically...');
    
    // Create container if needed
    let container = document.getElementById('chart-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chart-container';
        container.style.cssText = 'width: 100%; height: 400px; margin: 20px 0;';
        document.body.appendChild(container);
    }
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'bitcoin-chart';
    canvas.style.cssText = 'width: 100%; height: 100%;';
    container.appendChild(canvas);
    
    console.log('✅ Created bitcoin-chart element automatically');
    
    // Initialize chart after a short delay
    setTimeout(() => {
        window.bitcoinLiveChart = new BitcoinChart();
    }, 100);
}

// ============================================
// INITIALIZATION TRIGGERS
// ============================================

// Option 1: Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBitcoinChart);
} else {
    // DOM is already ready
    setTimeout(initializeBitcoinChart, 100);
}

// Option 2: Also try after a short delay (in case other scripts are still loading)
setTimeout(initializeBitcoinChart, 500);

// Option 3: Expose manual initialization
window.initBitcoinChart = function(elementId, options = {}) {
    const defaultOptions = {
        elementId: elementId || 'bitcoin-chart',
        updateInterval: 5000,
        maxDataPoints: 30
    };
    
    return new BitcoinChart({ ...defaultOptions, ...options });
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BitcoinChart, initBitcoinChart };
}