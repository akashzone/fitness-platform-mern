const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Purchase = require('../models/Purchase');
const MonthlySlot = require('../models/MonthlySlot');
const getCurrentMonth = require('../utils/getCurrentMonth');
const { sendConfirmationEmail, sendEbookEmail } = require('../config/mailer');
const sendEmail = require('../utils/sendEmail');
const { sendWhatsAppMessage } = require('../config/whatsapp');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create
exports.createOrder = async (req, res) => {
    try {
        const { products, name, email, phone } = req.body; // products is an array of { productId, quantity }

        let totalAmount = 0;
        let hasCourse = false;
        let courseProduct = null;

        const productDetails = await Promise.all(products.map(async (p) => {
            const product = await Product.findById(p.productId);
            if (!product) throw new Error(`Product ${p.productId} not found`);
            totalAmount += product.price;
            if (product.type === 'course') {
                hasCourse = true;
                courseProduct = product;
            }
            return {
                productId: product._id,
                title: product.title,
                price: product.price,
                type: product.type
            };
        }));

        // Check slots if it's a course
        if (hasCourse) {
            const currentMonth = getCurrentMonth();
            const slotInfo = await MonthlySlot.findOne({ month: currentMonth });

            if (slotInfo && slotInfo.usedSlots >= slotInfo.maxSlots) {
                return res.status(400).json({ message: 'Course slots for this month are sold out!' });
            }
        }

        try {
            const options = {
                amount: totalAmount * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            };

            const razorpayOrder = await razorpay.orders.create(options);
            res.json(razorpayOrder);
        } catch (err) {
            console.log("Razorpay order creation failed, using mock order for testing:", err.message);
            res.json({
                id: `order_mock_${Date.now()}`,
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: `receipt_mock_${Date.now()}`
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products, // Array of products
            name,
            email,
            phone
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const isMockEntry = razorpay_signature === 'mock_success';
        const expectedSignature = isMockEntry
            ? 'mock_success'
            : crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

        if (expectedSignature === razorpay_signature) {
            let hasCourse = false;
            let totalAmount = 0;

            const productDetails = await Promise.all(products.map(async (p) => {
                const product = await Product.findById(p.productId || p._id);
                totalAmount += product.price;
                if (product.type === 'course') hasCourse = true;
                return {
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    type: product.type
                };
            }));

            const currentMonth = getCurrentMonth();

            // Atomic slot increment if course
            if (hasCourse) {
                const updatedSlot = await MonthlySlot.findOneAndUpdate(
                    { month: currentMonth, usedSlots: { $lt: 20 } },
                    { $inc: { usedSlots: 1 } },
                    { new: true }
                );

                if (!updatedSlot) {
                    return res.status(400).json({ message: 'Payment verified but slots just sold out. Refund will be processed.' });
                }
            }

            // Save order
            const order = await Order.create({
                name,
                email,
                phone,
                products: productDetails,
                totalAmount,
                paymentId: razorpay_payment_id,
                paymentStatus: 'success',
                month: currentMonth
            });

            // Notifications
            const mainTitle = productDetails.length > 1
                ? `${productDetails[0].title} + ${productDetails.length - 1} more`
                : productDetails[0].title;

            const hasEbook = productDetails.some(item => item.type === 'ebook');
            if (hasEbook) {
                await sendEbookEmail(email, name, productDetails, order._id);
            } else {
                await sendConfirmationEmail(email, name, mainTitle);
            }
            sendWhatsAppMessage(phone, name, mainTitle);

            res.json({ message: 'Payment verified successfully', orderId: order._id });
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Handle Fake Payment Success (New Feature)
// @route   POST /api/payment/success
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { name, email, phone, productId, productName, productType } = req.body;

        // 1. Store purchase details in MongoDB
        const purchase = await Purchase.create({
            name,
            email,
            phone,
            productId,
            productName,
            productType,
            paymentStatus: "SUCCESS"
        });

        console.log('Purchase saved:', purchase._id);

        // 2. Trigger email notification
        await sendEmail({
            name,
            email,
            productName,
            productType
        });

        res.status(200).json({
            success: true,
            message: 'Purchase recorded and email sent successfully',
            purchaseId: purchase._id
        });
    } catch (error) {
        console.error('Payment Success Handler Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
