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

        const isLiveTest = process.env.LIVE_TEST_MODE === "true";
        const productsWithDisplayPrice = products.map(p => {
            const productObj = p.toObject();
            return {
                ...productObj,
                displayPrice: isLiveTest ? 30 : productObj.price,
                isLiveTest
            };
        });

        res.json({
            products: productsWithDisplayPrice,
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

            const isLiveTest = process.env.LIVE_TEST_MODE === "true";
            res.json({
                ...product.toObject(),
                displayPrice: isLiveTest ? 30 : product.price,
                isLiveTest,
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
