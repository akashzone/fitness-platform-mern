const axios = require('axios');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const runCashfreeTest = async () => {
    console.log('--- CASHFREE ISOLATED TEST START ---');

    const mask = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'EMPTY';
    console.log('Client ID:', mask(process.env.CASHFREE_CLIENT_ID));
    console.log('Secret:', process.env.CASHFREE_CLIENT_SECRET ? 'EXISTS' : 'MISSING');

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
                    'x-client-id': process.env.CASHFREE_CLIENT_ID,
                    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
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
