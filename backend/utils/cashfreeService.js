const axios = require('axios');

const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';
const BASE_URL = CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const cashfreeService = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
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
