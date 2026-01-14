const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        title: { type: String, required: true },
        duration: { type: String },
        price: { type: Number, required: true },
        type: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    gateway: { type: String, default: 'CASHFREE' },
    cfOrderId: { type: String, required: true },
    cfPaymentId: { type: String }, // Optional initially, populated after payment
    orderStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },
    month: { type: String, required: true }, // YYYY-MM
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
