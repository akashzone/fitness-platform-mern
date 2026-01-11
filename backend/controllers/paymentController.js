// Razorpay logic removed. Cashfree implementation will be added in a new controller.
const Purchase = require('../models/Purchase');
const sendEmail = require('../utils/sendEmail');

// @desc    Handle Fake Payment Success (New Feature)
// @route   POST /api/payment/success
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { name, email, phone, productId, productName, productType } = req.body;

        // 1. Store purchase details in MongoDB
        const purchase = await Purchase.create({
            name,
            email,
            phone,
            productId,
            productName,
            productType,
            paymentStatus: "SUCCESS"
        });

        console.log('Purchase saved:', purchase._id);

        // 2. Trigger email notification (NON-BLOCKING)
        sendEmail({
            name,
            email,
            productName,
            productType
        }).catch(err => console.error('Background Email Error:', err));

        res.status(200).json({
            success: true,
            message: 'Purchase recorded and email sent successfully',
            purchaseId: purchase._id
        });
    } catch (error) {
        console.error('Payment Success Handler Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
