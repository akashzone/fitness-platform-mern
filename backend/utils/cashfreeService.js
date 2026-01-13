const axios = require('axios');

/**
 * Get Cashfree Configuration
 */
const getCashfreeConfig = () => {
    const env = (process.env.CASHFREE_ENV || 'sandbox').trim().toLowerCase();
    const isProduction = env === 'production' || env === 'prod';

    const clientId = (process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID || '').trim();
    const clientSecret = (process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY || '').trim();
    const apiVersion = (process.env.CASHFREE_API_VERSION || '2023-08-01').trim();

    return {
        env,
        isProduction,
        baseUrl: isProduction ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg',
        clientId,
        clientSecret,
        apiVersion
    };
};

const config = getCashfreeConfig();
console.log(`[Cashfree] Service starting in ${config.isProduction ? 'PRODUCTION' : 'SANDBOX'} mode`);

if (!config.clientId || !config.clientSecret) {
    console.warn('[Cashfree] CRITICAL ERROR: API Credentials missing or empty!');
}

const cashfreeService = axios.create({
    baseURL: config.baseUrl,
    timeout: 10000 // 10s timeout
});

// Interceptor to always use fresh (and trimmed) headers
cashfreeService.interceptors.request.use(req => {
    const currentConfig = getCashfreeConfig();

    // Masking function for logs
    const mask = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'EMPTY';

    console.log(`[Cashfree API Request] Mode: ${currentConfig.isProduction ? 'PROD' : 'SANDBOX'} | URL: ${req.url}`);
    console.log(`[Cashfree Auth] ID: ${mask(currentConfig.clientId)} | Secret: ${currentConfig.clientSecret ? 'EXISTS' : 'MISSING'}`);

    req.headers['x-client-id'] = currentConfig.clientId;
    req.headers['x-client-secret'] = currentConfig.clientSecret;
    req.headers['x-api-version'] = currentConfig.apiVersion;
    req.headers['Content-Type'] = 'application/json';
    return req;
});

/**
 * Create a Cashfree Order
 */
exports.createOrder = async (orderData) => {
    try {
        const response = await cashfreeService.post('/orders', orderData);
        return response.data;
    } catch (error) {
        const errorData = error.response?.data || {};
        console.error("Cashfree API Error (Create):", errorData);

        // Enhance error message if it's an auth fail
        if (error.response?.status === 401 || errorData.code === 'authentication_failed') {
            throw new Error(`Cashfree Authentication Failed: Please check if your ${config.isProduction ? 'PRODUCTION' : 'SANDBOX'} keys are correct in environment variables.`);
        }

        throw errorData || error;
    }
};

/**
 * Get Order Details (Verification)
 */
exports.getOrder = async (orderId) => {
    try {
        const response = await cashfreeService.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        const errorData = error.response?.data || {};
        console.error("Cashfree API Error (Get):", errorData);
        throw errorData || error;
    }
};
