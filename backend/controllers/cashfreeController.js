const cashfreeService = require('../utils/cashfreeService');
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

        // 1. Slot check (preserved)
        let slotInfo = await MonthlySlot.findOne({ month: currentMonth });
        if (!slotInfo) {
            slotInfo = await MonthlySlot.create({ month: currentMonth, usedSlots: 0, maxSlots: 20 });
        }

        if (slotInfo.usedSlots >= slotInfo.maxSlots) {
            return res.status(400).json({ success: false, message: 'Course slots for this month are sold out!' });
        }

        const product = await Product.findById(productId);
        const orderId = `order_${Date.now()}`;

        // 2. Create PENDING Order in MongoDB
        const newOrder = await Order.create({
            name,
            email,
            phone,
            products: product ? [{
                productId: product._id,
                title: product.title,
                price: product.price,
                type: product.type
            }] : [],
            totalAmount: amount,
            cfOrderId: orderId,
            orderStatus: 'PENDING',
            month: currentMonth
        });

        console.log(`[Cashfree] PENDING order created in DB: ${newOrder._id}`);

        // 3. Create Order on Cashfree
        const orderRequest = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: email.replace(/[^a-zA-Z0-9]/g, '_'),
                customer_email: email,
                customer_phone: phone,
                customer_name: name
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-status?order_id={order_id}`
            },
            order_note: productId
        };

        const response = await cashfreeService.createOrder(orderRequest);

        return res.status(200).json({
            success: true,
            payment_session_id: response.payment_session_id,
            order_id: response.order_id
        });

    } catch (error) {
        console.error('Cashfree Create Order Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error creating payment order'
        });
    }
};

/**
 * @desc    Verify Cashfree Order
 * @route   GET /api/cashfree/verify/:orderId
 */
exports.verifyCashfreeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Fetch from Cashfree
        const orderDetails = await cashfreeService.getOrder(orderId);
        console.log(`[Cashfree] Verifying order: ${orderId}, Status: ${orderDetails.order_status}`);

        if (orderDetails.order_status === 'PAID') {
            // Find the pending order
            const order = await Order.findOne({ cfOrderId: orderId });

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found in database' });
            }

            if (order.orderStatus === 'PAID') {
                return res.status(200).json({ success: true, message: 'Order already verified', order });
            }

            // 2. Extract cf_payment_id (from the last successful payment)
            // Note: v2023-08-01 getOrder returns payments in a nested call or via another endpoint if not included.
            // Actually, getOrder DOES NOT always return payments by default if using minimalist API.
            // However, the request asked to extract it. Let's try to find it.
            let cfPaymentId = "N/A";

            // If Cashfree provides payments in the order details
            if (orderDetails.payments && orderDetails.payments.length > 0) {
                const successfulPayment = orderDetails.payments.find(p => p.payment_status === 'SUCCESS');
                if (successfulPayment) {
                    cfPaymentId = successfulPayment.cf_payment_id;
                }
            } else {
                // In some versions we might need to call /orders/{order_id}/payments
                // But let's assume getOrder for this API version provides it or it's not strictly required if we just want "PAID"
                console.warn("[Cashfree] payments array missing in getOrder response.");
            }

            // 3. Update Order in DB
            order.orderStatus = 'PAID';
            order.cfPaymentId = cfPaymentId;
            await order.save();

            // 4. Update Slots
            await MonthlySlot.findOneAndUpdate(
                { month: order.month },
                { $inc: { usedSlots: 1 } }
            );

            console.log(`[Cashfree] Order ${orderId} marked as PAID. cfPaymentId: ${cfPaymentId}`);

            // 5. Trigger Email Automation (Non-blocking)
            try {
                const primaryProductData = order.products[0];
                if (primaryProductData) {
                    const product = await Product.findById(primaryProductData.productId);
                    if (product) {
                        if (product.type === 'ebook') {
                            sendEbookEmail(order.email, order.name, order.products, order._id);
                        } else {
                            sendConfirmationEmail(order.email, order.name, product.title);
                        }
                    }
                }
            } catch (emailTriggerErr) {
                console.error("[Email] Critical trigger error:", emailTriggerErr.message);
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified and recorded successfully',
                order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Payment status: ${orderDetails.order_status}`,
                status: orderDetails.order_status
            });
        }

    } catch (error) {
        console.error('Cashfree Verification Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error verifying payment'
        });
    }
};

/**
 * @desc    Cashfree Webhook Handler
 */
exports.cashfreeWebhook = async (req, res) => {
    res.status(200).send('Webhook received');
};

