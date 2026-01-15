const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const MonthlySlot = require('../models/MonthlySlot');
const getCurrentMonth = require('./getCurrentMonth');

dotenv.config();

const products = [
    {
        id: "4-weeks-transformation",
        title: "4 Weeks Transformation",
        description: "Ignite your fitness journey with a focused 4-week personalized training and diet plan.",
        fullDescription: "The 4-Week Transformation is designed for those who need a jumpstart. This intensive program focuses on rapid adaptation, metabolic priming, and establishing the foundational habits required for long-term success. You'll receive a custom-tailored nutrition protocol and a high-intensity training split optimized for your specific goals.",
        price: 30,
        duration: "4 Weeks",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        type: "course",
        features: [
            "Personalized Workout Plan",
            "Customized Diet Plan",
            "Weekly Progress Tracking",
            "Text Support (8hrs/Day)",
            "1 Fixed Coaching Call/Week"
        ]
    },
    {
        id: "8-weeks-momentum",
        title: "8 Weeks Momentum",
        description: "Build serious consistency and see visible changes with our 8-week structured coaching.",
        fullDescription: "Consistency is where the magic happens. The 8-Week Momentum program dives deeper into body recomposition. We'll fine-tune your macronutrients and implement progressive overload techniques to ensure you don't just see changes in the mirror, but also feel the performance gains in the gym. Elite accountability included.",
        price: 9900,
        duration: "8 Weeks",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        type: "course",
        features: [
            "Personalized Workout & Diet",
            "Weekly Progress Tracking",
            "Text Support (12hrs/Day)",
            "1 Flexible Coaching Call/Week",
            "Instalments Available"
        ]
    },
    {
        id: "12-weeks-peak-performance",
        title: "12 Weeks Peak Performance",
        description: "Achieve your peak physique with our comprehensive 12-week elite coaching program.",
        fullDescription: "This is our flagship transformation program. 12 weeks of data-driven coaching designed to push you to your absolute peak. Whether you're aiming for a photo-shoot ready physique or elite-level strength, this program covers everything: metabolic periodization, advanced hypertrophy cycles, and psychological coaching to build an unbreakable mind.",
        price: 13500,
        duration: "12 Weeks",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        type: "course",
        features: [
            "Peak Performance Training",
            "Advanced Nutrition Mastery",
            "Supplement & Recipe Guidance",
            "Text Support (12hrs/Day)",
            "Flexible Coaching Calls"
        ]
    },
    {
        id: "20-weeks-elite-lifestyle",
        title: "20 Weeks Elite Lifestyle",
        description: "The ultimate lifestyle transformation for those committed to becoming the best version of themselves.",
        fullDescription: "Transformation isn't a destination; it's a lifestyle. The 20-Week Elite Lifestyle program is for the truly committed. We focus on sustainable transformation—teaching you the 'why' behind the 'what'. By the end of this program, you won't just have an elite physique; you'll have the knowledge to maintain it for the rest of your life.",
        price: 21000,
        duration: "20 Weeks",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        type: "course",
        features: [
            "24/7 Priority Text Support",
            "Flexible + Review Calls",
            "Full Lifestyle Discipline",
            "Advanced Supplement Guide",
            "Instalments Available"
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing
        await Product.deleteMany();
        await MonthlySlot.deleteMany();

        // Add products
        await Product.insertMany(products);

        // Add current month slot
        await MonthlySlot.create({
            month: getCurrentMonth(),
            maxSlots: 20,
            usedSlots: 0
        });

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
