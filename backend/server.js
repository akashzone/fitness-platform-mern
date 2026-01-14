require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cashfreeRoutes = require('./routes/cashfreeRoutes');

connectDB();


const app = express();

// Health check endpoint (for uptime monitoring)
app.get('/health', (req, res) => res.status(200).send('OK'));

app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const path = require('path');

app.use('/api/products', productRoutes);
app.use('/api/programs', productRoutes);
app.use('/api/cashfree', cashfreeRoutes);
app.use('/api/admin', adminRoutes);

// Diagnostic Email Test Route
app.get('/api/test-email', async (req, res) => {
    const { sendPurchaseConfirmationEmail } = require('./utils/sendEmail');
    const testEmail = req.query.email || 'fitwithpravinn@gmail.com';
    try {
        console.log(`[Test] Manually triggering Resend email to: ${testEmail}`);
        await sendPurchaseConfirmationEmail({
            to: testEmail,
            name: 'Test User',
            courseName: 'Diagnostic Fitness Program',
            months: '1',
            amount: 499,
            orderId: 'TEST_123'
        });
        res.status(200).json({ success: true, message: `Resend test email triggered to ${testEmail}. Check logs for result.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Serve static files from the frontend
// Check both root dist and client/dist for flexibility
const distPath = path.join(__dirname, '../dist');
const clientDistPath = path.join(__dirname, '../client/dist');

if (require('fs').existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
} else if (require('fs').existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientDistPath, 'index.html'));
        }
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Seed Admin User
const Admin = require('./models/Admin');
const seedAdmin = async () => {
    try {
        const adminEmail = 'fitwithpravinn'; // As requested
        const exists = await Admin.findOne({ email: adminEmail });
        if (!exists) {
            await Admin.create({ email: adminEmail, password: '123456' });
            console.log('Default admin created.');
        }
    } catch (err) {
        console.error('Admin seed error:', err);
    }
};
seedAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
