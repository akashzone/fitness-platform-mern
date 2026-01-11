const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        type: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    gateway: { type: String, default: 'CASHFREE' },
    paymentId: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    month: { type: String, required: true }, // YYYY-MM
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
