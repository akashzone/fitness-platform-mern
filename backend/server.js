const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/products', productRoutes);
app.use('/api/programs', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

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

app.get('/', (req, res) => {
    res.send('Fitness Platform API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
