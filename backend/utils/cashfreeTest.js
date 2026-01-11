const axios = require('axios');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const runCashfreeTest = async () => {
    console.log('--- CASHFREE ISOLATED TEST START ---');

    console.log('App ID:', process.env.CASHFREE_APP_ID);
    console.log('Secret Exists:', !!process.env.CASHFREE_SECRET_KEY);

    try {
        const response = await axios.post(
            'https://sandbox.cashfree.com/pg/orders',
            {
                order_amount: 100,
                order_currency: 'INR',
                order_id: 'test_iso_' + Date.now(),
                customer_details: {
                    customer_id: 'test_user_001',
                    customer_phone: '9999999999',
                    customer_email: 'test@example.com',
                    customer_name: 'Test Customer'
                }
            },
            {
                headers: {
                    'x-client-id': process.env.CASHFREE_APP_ID,
                    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                    'x-api-version': '2023-08-01',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Cashfree Test Success');
        console.log('Order ID:', response.data.order_id);
        console.log('Session ID:', response.data.payment_session_id);

    } catch (error) {
        console.log('❌ Cashfree Test Failed');
        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log('Network/Code Error:', error.message);
        }
    }

    console.log('--- CASHFREE ISOLATED TEST END ---');
};

if (require.main === module) {
    runCashfreeTest();
}

module.exports = runCashfreeTest;
