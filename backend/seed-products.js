const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const courses = [
    {
        title: "4 Weeks Transformation",
        duration: "4 Weeks",
        description: "Ignite your fitness journey with a focused 4-week personalized training and diet plan.",
        price: 5800,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Personalized Workout Plan",
            "Customized Diet Plan",
            "Weekly Progress Tracking",
            "Text Support (8hrs/Day)",
            "1 Fixed Coaching Call/Week"
        ],
        fullDescription: "Our 4-week intensive program is designed to kickstart your metabolic health and establish sustainable habits. You'll receive a detailed workout protocol and a nutrition plan tailored to your specific goals, with weekly check-ins to ensure you're on the right track.",
        type: "course"
    },
    {
        title: "8 Weeks Momentum",
        duration: "8 Weeks",
        description: "Build serious consistency and see visible changes with our 8-week structured coaching.",
        price: 9900,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Personalized Workout & Diet",
            "Weekly Progress Tracking",
            "Text Support (12hrs/Day)",
            "1 Flexible Coaching Call/Week",
            "Instalments Available"
        ],
        fullDescription: "The 8-week program focuses on cementing your progress. With more flexible coaching calls and extended daily support, we dive deeper into your performance metrics and lifestyle adjustments to ensure long-term results.",
        type: "course"
    },
    {
        title: "12 Weeks Peak Performance",
        duration: "12 Weeks",
        description: "Achieve your peak physique with our comprehensive 12-week elite coaching program.",
        price: 13500,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Peak Performance Training",
            "Advanced Nutrition Mastery",
            "Supplement & Recipe Guidance",
            "Text Support (12hrs/Day)",
            "Flexible Coaching Calls"
        ],
        fullDescription: "This is our signature transformation block. Over 12 weeks, we master your biology. From supplement protocols to advanced recipe tips, this course leaves no stone unturned in your pursuit of excellence.",
        type: "course"
    },
    {
        title: "20 Weeks Elite Lifestyle",
        duration: "20 Weeks",
        description: "The ultimate lifestyle transformation for those committed to becoming the best version of themselves.",
        price: 21000,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        features: [
            "24/7 Priority Text Support",
            "Flexible + Review Calls",
            "Full Lifestyle Discipline",
            "Advanced Supplement Guide",
            "Instalments Available"
        ],
        fullDescription: "The 20-week Elite Lifestyle program is more than just fitness; it reflects a complete transformation of your discipline and mindset. With 24/7 priority support and regular review calls, this is the highest level of accountability available.",
        type: "course"
    }
];

const ebooks = [
    {
        title: "Science of Transformation",
        description: "The complete guide to understanding hyper-trophy, calorie deficit, and metabolism.",
        price: 1499,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        type: "ebook",
        features: [
            "100+ Scientific References",
            "Detailed Macronutrient Guide",
            "Sample Meal Plans",
            "Training Periodization Logic",
            "Lifetime Access"
        ],
        fullDescription: "Unlock the secrets of true body transformation. 'Science of Transformation' isn't just a book; it's a comprehensive manual that breaks down the complex physiology of muscle growth and fat loss into simple, actionable steps. Whether you're a beginner confused by conflicting advice or an advanced athlete looking to break a plateau, this guide covers everything from metabolic adaptation to advanced hypertrophy training techniques. Stop guessing and start training with science."
    },
    {
        title: "Discipline Blueprint",
        description: "Master your mindset, habits, and daily routine to achieve your fitness goals and beyond.",
        price: 999,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
        type: "ebook",
        features: [
            "Daily Routine Checklists",
            "Habit Formation Framework",
            "Mindset Shift Exercises",
            "Productivity Hacks",
            "Printable Accountability Trackers"
        ],
        fullDescription: "Discipline is the bridge between goals and accomplishment. This blueprint provides a psychological framework to master your mind and build unbreakable habits. We dive deep into the neuroscience of habit formation, offering practical daily checklists and mental exercises to help you overcome procrastination, stay consistent, and achieve elite levels of productivity in fitness and life."
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas for seeding...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Seed Courses
        const createdCourses = await Product.insertMany(courses);
        console.log(`Successfully seeded ${createdCourses.length} courses.`);

        // Seed Ebooks
        const createdEbooks = await Product.insertMany(ebooks);
        console.log(`Successfully seeded ${createdEbooks.length} ebooks.`);

        console.log('All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
