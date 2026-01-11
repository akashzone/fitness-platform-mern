const Cashfree = require('../config/cashfree');
const crypto = require('crypto');
const Order = require('../models/Order');
const MonthlySlot = require('../models/MonthlySlot');
const Product = require('../models/Product');
const getCurrentMonth = require('../utils/getCurrentMonth');
const { sendConfirmationEmail, sendEbookEmail } = require('../config/mailer');

/**
 * @desc    Create Cashfree Order
 * @route   POST /api/cashfree/create-order
 */
exports.createCashfreeOrder = async (req, res) => {
    try {
        const { amount, name, email, phone, productId } = req.body;

        const currentMonth = getCurrentMonth();

        let slotInfo = await MonthlySlot.findOne({ month: currentMonth });
        if (!slotInfo) {
            slotInfo = await MonthlySlot.create({
                month: currentMonth,
                usedSlots: 0,
                maxSlots: 20
            });
        }

        if (slotInfo.usedSlots >= slotInfo.maxSlots) {
            return res.status(400).json({
                success: false,
                message: 'Course slots for this month are sold out!'
            });
        }

        const orderId = `order_${Date.now()}`;

        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: email.replace(/[^a-zA-Z0-9]/g, '_'),
                customer_phone: phone,
                customer_email: email,
                customer_name: name
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL}/payment-status?order_id={order_id}`,
                notify_url: `${process.env.BACKEND_URL}/api/cashfree/webhook`
            },
            order_note: productId
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);

        return res.status(200).json({
            success: true,
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id
        });

    } catch (error) {
        console.error('Cashfree Create Order Error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Error creating payment order'
        });
    }
};

/**
 * @desc    Cashfree Webhook Handler
 * @route   POST /api/cashfree/webhook
 */
exports.cashfreeWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        const timestamp = req.headers['x-webhook-timestamp'];
        const rawBody = JSON.stringify(req.body);

        try {
            Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
        } catch {
            return res.status(400).send('Invalid signature');
        }

        const { data, type } = req.body;
        const orderData = data.order;
        const paymentData = data.payment;

        if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const currentMonth = getCurrentMonth();

            const updatedSlot = await MonthlySlot.findOneAndUpdate(
                { month: currentMonth, usedSlots: { $lt: 20 } },
                { $inc: { usedSlots: 1 } },
                { new: true }
            );

            if (!updatedSlot) {
                return res.status(200).send('Slots full');
            }

            const product = await Product.findById(orderData.order_note);

            const newOrder = await Order.create({
                name: orderData.customer_details.customer_name,
                email: orderData.customer_details.customer_email,
                phone: orderData.customer_details.customer_phone,
                products: [{
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    type: product.type
                }],
                totalAmount: orderData.order_amount,
                gateway: 'CASHFREE',
                paymentId: paymentData.cf_payment_id,
                paymentStatus: 'SUCCESS',
                month: currentMonth
            });

            if (product.type === 'ebook') {
                sendEbookEmail(newOrder.email, newOrder.name, newOrder.products, newOrder._id);
            } else {
                sendConfirmationEmail(newOrder.email, newOrder.name, product.title);
            }
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook Handling Error:', error.message);
        res.status(500).send('Webhook Error');
    }
};
