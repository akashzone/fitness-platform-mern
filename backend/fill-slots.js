require('dotenv').config();
const mongoose = require('mongoose');
const MonthlySlot = require('./models/MonthlySlot');

const fillSlots = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Hardcoded for testing based on current date context
        const currentMonth = '2026-01';

        let slot = await MonthlySlot.findOne({ month: currentMonth });

        if (!slot) {
            console.log(`Slot for ${currentMonth} not found. Creating one...`);
            slot = await MonthlySlot.create({ month: currentMonth, maxSlots: 20, usedSlots: 0 });
        } else {
            console.log(`Slot for ${currentMonth} found. Resetting usedSlots to 0...`);
            slot.usedSlots = 0;
            await slot.save();
        }

        console.log('✅ Slots filled successfully! Current state:', slot);
    } catch (error) {
        console.error('❌ Error filling slots:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB Connection Closed');
        process.exit();
    }
};

fillSlots();
