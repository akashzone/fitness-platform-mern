const cashfreeService = require('../utils/cashfreeService');
const Order = require('../models/Order');
const MonthlySlot = require('../models/MonthlySlot');
const Product = require('../models/Product');
const getCurrentMonth = require('../utils/getCurrentMonth');
const { sendPurchaseConfirmationEmail } = require('../utils/sendEmail');

/**
 * @desc    Create Cashfree Order
 * @route   POST /api/cashfree/create-order
 */
exports.createCashfreeOrder = async (req, res) => {
    try {
        const { amount, name, email, phone, productId, durationMonths } = req.body;

        const currentMonth = getCurrentMonth();

        // 1. Slot check (preserved)
        let slotInfo = await MonthlySlot.findOne({ month: currentMonth });
        if (!slotInfo) {
            slotInfo = await MonthlySlot.create({ month: currentMonth, usedSlots: 0, maxSlots: 20 });
        }

        if (slotInfo.usedSlots >= slotInfo.maxSlots) {
            return res.status(400).json({ success: false, message: 'Course slots for this month are sold out!' });
        }

        const product = await Product.findOne({ id: productId });
        const orderId = `order_${Date.now()}`;

        // 2. Create PENDING Order in MongoDB
        const newOrder = await Order.create({
            name,
            email,
            phone,
            products: product ? [{
                productId: product.id,
                title: product.title,
                duration: durationMonths ? `${durationMonths} Months` : product.duration,
                price: amount,
                type: product.type || 'COURSE' // Safe fallback
            }] : [{
                productId: productId,
                title: "Custom Order",
                duration: durationMonths ? `${durationMonths} Months` : "N/A",
                price: amount,
                type: 'COURSE'
            }],
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
                return_url: `${process.env.FRONTEND_URL || 'https://fitwithpravinn.com'}/payment-status?order_id={order_id}`
            },
            order_note: productId
        };

        const response = await cashfreeService.createOrder(orderRequest);


        return res.status(200).json({
            success: true,
            payment_session_id: response.payment_session_id,
            order_id: response.order_id,
            environment: cashfreeService.getIsProduction() ? 'production' : 'sandbox'
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
            const order = await Order.findOne({ cfOrderId: orderId });

            if (!order) {
                console.error(`[Cashfree Fulfillment] Order ${orderId} not found in database!`);
                return res.status(404).json({ success: false, message: 'Order not found in database' });
            }

            if (order.orderStatus === 'PAID') {
                return res.status(200).json({ success: true, message: 'Order already fulfilled', order });
            }

            // 1. Update Order in DB first
            order.orderStatus = 'PAID';

            // Try to find a payment ID for logging, but don't fail if missing
            if (orderDetails.payments && orderDetails.payments.length > 0) {
                const successfulPayment = orderDetails.payments.find(p => p.payment_status === 'SUCCESS');
                if (successfulPayment) {
                    order.cfPaymentId = successfulPayment.cf_payment_id;
                }
            }

            await order.save();

            // 2. Update Slots
            await MonthlySlot.findOneAndUpdate(
                { month: order.month },
                { $inc: { usedSlots: 1 } }
            );

            console.log(`[Cashfree Fulfillment] Order ${orderId} matched as PAID and fulfilled in DB.`);

            // 3. Trigger Email Automation (Non-blocking & Retry-safe logged)
            setImmediate(async () => {
                try {
                    const primaryProductData = order.products[0];
                    if (!primaryProductData) return;

                    const product = await Product.findOne({ id: primaryProductData.productId });
                    if (!product) {
                        console.error(`[Email Automation] Product ${primaryProductData.productId} not found for order ${orderId}`);
                        return;
                    }

                    const emailResult = await sendPurchaseConfirmationEmail({
                        to: order.email,
                        name: order.name,
                        courseName: product.title,
                        months: product.duration || 'N/A',
                        amount: order.totalAmount,
                        orderId: order.cfOrderId
                    });

                    if (emailResult && emailResult.success) {
                        console.log(`[Email Automation] Confirmation successfully sent to ${order.email}`);
                    } else {
                        console.error(`[Email Automation] FAILED for ${order.email}:`, emailResult ? emailResult.error : 'Unknown error');
                    }
                } catch (emailErr) {
                    console.error(`[Email Automation] Exception for ${order.email}:`, emailErr.message);
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Payment verified and fulfillment completed.',
                order
            });
        }
        else {
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
    try {
        console.log('[Cashfree Webhook] Received:', JSON.stringify(req.body, null, 2));

        const data = req.body.data;
        const type = req.body.type;

        if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const orderId = data.order.order_id;
            console.log(`[Cashfree Webhook] Processing Success for Order: ${orderId}`);

            // To ensure security and latest status, fetch from Cashfree API directly
            // This avoids needing complex signature verification logic here by relying on our own authenticated API call
            const orderDetails = await cashfreeService.getOrder(orderId);

            if (orderDetails.order_status === 'PAID') {
                const order = await Order.findOne({ cfOrderId: orderId });

                if (!order) {
                    console.error(`[Webhook] Order ${orderId} not found in DB`);
                    return res.status(404).json({ message: 'Order not found' });
                }

                if (order.orderStatus === 'PAID') {
                    console.log(`[Webhook] Order ${orderId} already fulfilled. Skipping.`);
                    return res.status(200).json({ message: 'Already fulfilled' });
                }

                // 1. Update Order
                order.orderStatus = 'PAID';
                if (orderDetails.payments && orderDetails.payments.length > 0) {
                    const successfulPayment = orderDetails.payments.find(p => p.payment_status === 'SUCCESS');
                    if (successfulPayment) {
                        order.cfPaymentId = successfulPayment.cf_payment_id;
                    }
                }
                await order.save();

                // 2. Update Slots
                await MonthlySlot.findOneAndUpdate(
                    { month: order.month },
                    { $inc: { usedSlots: 1 } }
                );

                console.log(`[Webhook] Order ${orderId} fulfilled successfully via Webhook.`);

                // 3. Send Email
                const primaryProductData = order.products[0];
                if (primaryProductData) {
                    const product = await Product.findOne({ id: primaryProductData.productId });
                    if (product) {
                        const emailResult = await sendPurchaseConfirmationEmail({
                            to: order.email,
                            name: order.name,
                            courseName: product.title,
                            months: product.duration || 'N/A',
                            amount: order.totalAmount,
                            orderId: order.cfOrderId
                        });

                        if (emailResult && emailResult.success) {
                            console.log(`[Webhook Email] Sent to ${order.email}`);
                        } else {
                            console.error(`[Webhook Email] FAILED for ${order.email}:`, emailResult?.error);
                        }
                    }
                }
            }
        }

        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (err) {
        console.error('[Cashfree Webhook] Error:', err);
        res.status(500).json({ message: err.message });
    }
};

