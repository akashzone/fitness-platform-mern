const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handlePaymentSuccess } = require('../controllers/paymentController');
const { sendConfirmationEmail, sendEbookEmail } = require('../config/mailer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const getCurrentMonth = require('../utils/getCurrentMonth');

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.post('/success', handlePaymentSuccess);

// @desc    Store order directly (Test Flow - No Gateway)
// @route   POST /api/payment/checkout-test
const MonthlySlot = require('../models/MonthlySlot');
const mongoose = require('mongoose');

router.post('/checkout-test', async (req, res) => {
    try {
        const { fullName, email, phone, items, totalAmount } = req.body;
        console.log('Checkout Test Flow started for:', email);

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        const currentMonth = getCurrentMonth();
        const hasCourse = items.some(item => (item.type || '').toLowerCase() === 'course');

        if (hasCourse) {
            // Atomic slot increment with capacity check (Max 20)
            const updatedSlot = await MonthlySlot.findOneAndUpdate(
                { month: currentMonth, usedSlots: { $lt: 20 } },
                { $inc: { usedSlots: 1 } },
                { new: true }
            );

            if (!updatedSlot) {
                return res.status(400).json({
                    success: false,
                    message: 'All course slots for this month are sold out!'
                });
            }
        }

        const order = new Order({
            name: fullName,
            email,
            phone,
            products: items.map(item => {
                const pid = item.productId || item.id || item._id;
                return {
                    productId: mongoose.Types.ObjectId.isValid(pid) ? new mongoose.Types.ObjectId(pid) : pid,
                    title: item.title || 'Unknown Product',
                    price: item.price || 0,
                    type: (item.type || 'course').toLowerCase()
                };
            }),
            totalAmount,
            paymentId: 'TEST_' + Date.now(),
            paymentStatus: 'paid',
            month: currentMonth
        });

        await order.save();
        console.log('Order saved successfully:', order._id);

        // TRIGGER EBOOK DELIVERY IF APPLICABLE
        const hasEbook = items.some(item => (item.type || '').toLowerCase() === 'ebook');
        if (hasEbook) {
            // We pass the items directly as they contain title and productId
            await sendEbookEmail(email, fullName, items, order._id);
        } else {
            // Send standard confirmation for courses
            await sendConfirmationEmail(email, fullName, items[0]?.title || 'Program');
        }

        res.status(201).json({
            success: true,
            orderId: order._id,
            slotInfo: hasCourse ? 'Slot updated' : 'N/A'
        });
    } catch (error) {
        console.error('Test Checkout Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]:`, error.errors[key].message);
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
            validationErrors: error.errors ? Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key].message;
                return acc;
            }, {}) : null
        });
    }
});

module.exports = router;
