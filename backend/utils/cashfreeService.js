const axios = require('axios');

const getCashfreeConfig = () => {
    const rawEnv = (process.env.CASHFREE_ENV || 'SANDBOX').trim().toUpperCase();
    const isProduction = rawEnv === 'PROD' || rawEnv === 'PRODUCTION';

    const clientId = (process.env.CASHFREE_APP_ID || '').trim();
    const clientSecret = (process.env.CASHFREE_SECRET_KEY || '').trim();
    const apiVersion = (process.env.CASHFREE_API_VERSION || '2023-08-01').trim();

    const baseUrl = isProduction
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    return {
        env: isProduction ? 'PROD' : 'SANDBOX',
        isProduction,
        baseUrl,
        clientId,
        clientSecret,
        apiVersion
    };
};

const config = getCashfreeConfig();
console.log(`[Cashfree] Running in ${config.env} mode`);

if (!config.clientId || !config.clientSecret) {
    console.warn('\n[Cashfree] ⚠️  CRITICAL: API Credentials missing or empty!');
}

// CRITICAL SAFETY CHECK
if (config.isProduction && config.clientId.startsWith('TEST')) {
    const errorMsg = `
    🚨 FATAL ERROR: PRODUCTION MODE DETECTED BUT TEST KEYS FOUND! 🚨
    -------------------------------------------------------------
    You have set CASHFREE_ENV=PROD but are using keys starting with 'TEST'.
    This is extremely dangerous and will result in 401 Unauthorized errors.
    
    ACTION REQUIRED:
    1. Go to Render Dashboard -> Environment.
    2. Replace CASHFREE_APP_ID with your PRODUCTION Client ID.
    3. Replace CASHFREE_SECRET_KEY with your PRODUCTION Client Secret.
    -------------------------------------------------------------
    `;
    console.error(errorMsg);
    throw new Error(errorMsg); // Stop the server to prevent accidental live usage with bad config
}

// Export functions to get current state dynamically
exports.getIsProduction = () => getCashfreeConfig().isProduction;
exports.getBaseUrl = () => getCashfreeConfig().baseUrl;

const cashfreeService = axios.create({
    baseURL: config.baseUrl,
    timeout: 10000 // 10s timeout
});

// Interceptor to always use fresh (and trimmed) headers
cashfreeService.interceptors.request.use(req => {
    const currentConfig = getCashfreeConfig();

    // Masking function for logs
    const mask = (str) => {
        if (!str) return 'EMPTY';
        if (str.length <= 8) return '****';
        return `${str.substring(0, 4)}****${str.substring(str.length - 4)}`;
    };

    console.log(`[Cashfree API Request] Mode: ${currentConfig.env} | URL: ${currentConfig.baseUrl}${req.url}`);
    console.log(`[Cashfree Auth] ID: ${mask(currentConfig.clientId)} | Secret: ${currentConfig.clientSecret ? 'EXISTS' : 'MISSING'}`);

    req.baseURL = currentConfig.baseUrl; // Ensure correct endpoint is used every time
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
        const currentConfig = getCashfreeConfig();
        console.error(`Cashfree API Error (Create) [Mode: ${currentConfig.isProduction ? 'PROD' : 'SANDBOX'}]:`, errorData);

        // Enhance error message if it's an auth fail
        if (error.response?.status === 401 || errorData.code === 'authentication_failed') {
            throw new Error(`Cashfree Authentication Failed: Please check if your ${currentConfig.isProduction ? 'PRODUCTION' : 'SANDBOX'} keys are correct in environment variables.`);
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
