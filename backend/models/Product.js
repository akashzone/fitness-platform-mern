const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Semantic ID like '4-weeks-transformation'
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    fullDescription: { type: String },
    features: [{ type: String }],
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: String, default: 'COURSE' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
