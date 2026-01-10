const Product = require('../models/Product');
const MonthlySlot = require('../models/MonthlySlot');
const getCurrentMonth = require('../utils/getCurrentMonth');

// @desc    Get all active products with slot info
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        const currentMonth = getCurrentMonth();

        let slotInfo = await MonthlySlot.findOne({ month: currentMonth });

        // Auto-initialize month document if not exists
        if (!slotInfo) {
            slotInfo = await MonthlySlot.create({ month: currentMonth });
        }

        res.json({
            products,
            slotInfo: {
                month: slotInfo.month,
                maxSlots: slotInfo.maxSlots,
                usedSlots: slotInfo.usedSlots,
                slotsLeft: slotInfo.maxSlots - slotInfo.usedSlots,
                isSoldOut: slotInfo.usedSlots >= slotInfo.maxSlots
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const currentMonth = getCurrentMonth();
            let slotInfo = await MonthlySlot.findOne({ month: currentMonth });

            // Auto-initialize month document if not exists
            if (!slotInfo) {
                slotInfo = await MonthlySlot.create({ month: currentMonth });
            }

            res.json({
                ...product.toObject(),
                slotInfo: {
                    month: slotInfo.month,
                    maxSlots: slotInfo.maxSlots,
                    usedSlots: slotInfo.usedSlots,
                    slotsLeft: slotInfo.maxSlots - slotInfo.usedSlots,
                    isSoldOut: slotInfo.usedSlots >= slotInfo.maxSlots
                }
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
