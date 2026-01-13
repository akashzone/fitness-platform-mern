const axios = require('axios');

console.log(`[Cashfree] Initializing in ${process.env.CASHFREE_ENV || 'sandbox'} mode`);
if (!process.env.CASHFREE_CLIENT_ID && !process.env.CASHFREE_APP_ID) {
    console.warn('[Cashfree] WARNING: API Keys (Client ID) not found in environment variables!');
}

const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';
// Support both 'sandbox'/'production' and 'TEST'/'PROD' as values
const isProduction = CASHFREE_ENV.toLowerCase() === 'production' || CASHFREE_ENV.toUpperCase() === 'PROD';

const BASE_URL = isProduction
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const cashfreeService = axios.create({
    baseURL: BASE_URL,
    headers: {
        // Fallback to APP_ID/SECRET_KEY if CLIENT_ID/CLIENT_SECRET is missing
        'x-client-id': process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY,
        'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01',
        'Content-Type': 'application/json'
    }
});

/**
 * Create a Cashfree Order
 * @param {Object} orderData 
 */
exports.createOrder = async (orderData) => {
    try {
        const response = await cashfreeService.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error("Cashfree API Error (Create):", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Get Order Details (Verification)
 * @param {string} orderId 
 */
exports.getOrder = async (orderId) => {
    try {
        const response = await cashfreeService.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Cashfree API Error (Get):", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
