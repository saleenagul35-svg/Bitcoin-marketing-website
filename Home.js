let mainhome = document.querySelectorAll(".mainhome");
if (localStorage.getItem("theme") === "lighter-mode") {
    mainhome.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      mainhome.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}


// bitcoin price
// Live Bitcoin Price Tracker
// Add this script to your HTML and create a div with id="bitcoin-price"

class BitcoinPrice {
    constructor(options = {}) {
        this.options = {
            currency: 'USD',
            updateInterval: 10000, // 10 seconds
            showChange: true,
            apiProvider: 'coingecko', // 'coingecko', 'binance', or 'coincap'
            elementId: 'bitcoin-price',
            ...options
        };
        
        this.priceElement = document.getElementById(this.options.elementId);
        this.currentPrice = null;
        this.previousPrice = null;
        
        if (!this.priceElement) {
            console.error(`Element with id="${this.options.elementId}" not found`);
            return;
        }
        
        this.init();
    }
    
    async init() {
        // Display loading
        this.priceElement.innerHTML = 'Loading BTC price...';
        
        // Initial fetch
        await this.fetchPrice();
        
        // Set up auto-refresh
        setInterval(() => this.fetchPrice(), this.options.updateInterval);
    }
    
    async fetchPrice() {
        try {
            const apiUrl = this.getApiUrl();
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const priceData = this.parseApiResponse(data);
            
            this.updateDisplay(priceData);
            
        } catch (error) {
            console.error('Error fetching Bitcoin price:', error);
            this.priceElement.innerHTML = 'Error loading price';
            
            // Try alternative API if current one fails
            if (this.options.apiProvider === 'coingecko') {
                this.options.apiProvider = 'binance';
                setTimeout(() => this.fetchPrice(), 2000);
            }
        }
    }
    
    getApiUrl() {
        const providers = {
            'coingecko': `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${this.options.currency.toLowerCase()}&include_24h_change=true`,
            'binance': 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
            'coincap': `https://api.coincap.io/v2/assets/bitcoin`,
            'cryptocompare': `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${this.options.currency}`
        };
        
        return providers[this.options.apiProvider] || providers.coingecko;
    }
    
    parseApiResponse(data) {
        switch (this.options.apiProvider) {
            case 'coingecko':
                return {
                    price: data.bitcoin[this.options.currency.toLowerCase()],
                    change24h: data.bitcoin[`${this.options.currency.toLowerCase()}_24h_change`]
                };
                
            case 'binance':
                return {
                    price: parseFloat(data.price),
                    change24h: null // Binance price endpoint doesn't provide 24h change
                };
                
            case 'coincap':
                return {
                    price: parseFloat(data.data.priceUsd),
                    change24h: parseFloat(data.data.changePercent24Hr)
                };
                
            case 'cryptocompare':
                return {
                    price: data[this.options.currency],
                    change24h: null
                };
                
            default:
                throw new Error('Invalid API provider');
        }
    }
    
    updateDisplay(priceData) {
        const formattedPrice = this.formatPrice(priceData.price);
        const previousPrice = this.currentPrice;
        this.currentPrice = priceData.price;
        
        let displayHTML = `BTC/${this.options.currency}: ${formattedPrice}`;
        
        // Add 24h change if available and enabled
        if (this.options.showChange && priceData.change24h !== null) {
            const changeClass = priceData.change24h >= 0 ? 'price-up' : 'price-down';
            const changeSymbol = priceData.change24h >= 0 ? '↗' : '↘';
            displayHTML += ` <span class="${changeClass}">${changeSymbol} ${Math.abs(priceData.change24h).toFixed(2)}%</span>`;
        }
        
        // Add update time
        displayHTML += ` <small>(${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</small>`;
        
        this.priceElement.innerHTML = displayHTML;
        
        // Add animation if price changed
        if (previousPrice !== null) {
            this.animatePriceChange(priceData.price, previousPrice);
        }
    }
    
    formatPrice(price) {
        const currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        };
        
        const symbol = currencySymbols[this.options.currency] || this.options.currency + ' ';
        
        if (price >= 1000) {
            return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return `${symbol}${price.toFixed(2)}`;
        }
    }
    
    animatePriceChange(newPrice, oldPrice) {
        if (newPrice > oldPrice) {
            this.priceElement.classList.add('price-rise');
            setTimeout(() => this.priceElement.classList.remove('price-rise'), 1000);
        } else if (newPrice < oldPrice) {
            this.priceElement.classList.add('price-fall');
            setTimeout(() => this.priceElement.classList.remove('price-fall'), 1000);
        }
    }
    
    // Public method to manually update price
    async refresh() {
        await this.fetchPrice();
    }
    
    // Change API provider dynamically
    setApiProvider(provider) {
        if (['coingecko', 'binance', 'coincap', 'cryptocompare'].includes(provider)) {
            this.options.apiProvider = provider;
            this.fetchPrice();
        }
    }
    
    // Change update interval
    setUpdateInterval(interval) {
        this.options.updateInterval = interval;
        // Note: You'd need to clear the existing interval and set a new one
    }
}

// Initialize automatically if element exists
document.addEventListener('DOMContentLoaded', () => {
    const priceElement = document.getElementById('bitcoin-price');
    if (priceElement) {
        window.bitcoinPriceTracker = new BitcoinPrice();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinPrice;
}