const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Order = require('../models/Order');
const Purchase = require('../models/Purchase');
const MonthlySlot = require('../models/MonthlySlot');

const clearDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for cleanup.');

        // Delete collections related to customer activity
        const orderResult = await Order.deleteMany({});
        const purchaseResult = await Purchase.deleteMany({});

        // Reset monthly slots (delete them so they can be re-initialized by the server/seed)
        const slotResult = await MonthlySlot.deleteMany({});

        console.log(`Successfully cleared:`);
        console.log(`- ${orderResult.deletedCount} Orders`);
        console.log(`- ${purchaseResult.deletedCount} Purchases`);
        console.log(`- ${slotResult.deletedCount} Monthly Slot entries`);

        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

clearDB();
