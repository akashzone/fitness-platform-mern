const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');

// Middleware to protect routes
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        const admin = await Admin.findById(decoded.id);
        if (!admin) throw new Error();
        req.admin = admin;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// @desc    Admin Login
// @route   POST /api/admin/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all orders (optionally filtered by period)
// @route   GET /api/admin/orders
router.get('/orders', auth, async (req, res) => {
    try {
        const { period } = req.query;
        let query = {};

        if (period && period !== 'all') {
            const days = parseInt(period);
            const date = new Date();
            date.setDate(date.getDate() - days);
            query.createdAt = { $gte: date };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get analytics summary
// @route   GET /api/admin/analytics
router.get('/analytics', auth, async (req, res) => {
    try {
        const { period } = req.query;
        let query = {};

        if (period && period !== 'all') {
            const days = parseInt(period);
            const date = new Date();
            date.setDate(date.getDate() - days);
            query.createdAt = { $gte: date };
        }

        const orders = await Order.find(query);

        let totalOrders = orders.length;
        let totalRevenue = 0;
        let courseRevenue = 0;
        let ebookRevenue = 0;

        orders.forEach(order => {
            totalRevenue += order.totalAmount;
            order.products.forEach(product => {
                if (product.type === 'course') {
                    courseRevenue += product.price;
                } else if (product.type === 'ebook') {
                    ebookRevenue += product.price;
                }
            });
        });

        res.json({
            success: true,
            summary: {
                totalOrders,
                totalRevenue,
                courseRevenue,
                ebookRevenue,
                period: period || 'all'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
