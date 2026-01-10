const mongoose = require('mongoose');

const monthlySlotSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true }, // Format: YYYY-MM
    maxSlots: { type: Number, default: 20 },
    usedSlots: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonthlySlot', monthlySlotSchema);
