const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const count = await Product.countDocuments();
        console.log(`Total Products: ${count}`);

        if (count > 0) {
            const products = await Product.find({}, 'title type');
            console.log('Products:', products);
        } else {
            console.log('No products found in database.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

checkProducts();
