const Product = require('../models/Product');
const MonthlySlot = require('../models/MonthlySlot');
const getCurrentMonth = require('../utils/getCurrentMonth');

// @desc    Get monthly slot info
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const currentMonth = getCurrentMonth();
        let slotInfo = await MonthlySlot.findOne({ month: currentMonth });

        // Auto-initialize month document if not exists
        if (!slotInfo) {
            slotInfo = await MonthlySlot.create({ month: currentMonth });
        }

        const products = await Product.find({ isActive: true }).select('-image');

        res.json({
            slotInfo: {
                month: slotInfo.month,
                maxSlots: slotInfo.maxSlots,
                usedSlots: slotInfo.usedSlots,
                slotsLeft: slotInfo.maxSlots - slotInfo.usedSlots,
                isSoldOut: slotInfo.usedSlots >= slotInfo.maxSlots
            },
            products // Return the products list
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

