const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const courses = [
    {
        id: "foundation-plan",
        title: "FOUNDATION PLAN",
        duration: "One-time",
        description: "• Customised Diet Plan\n• Customised Workout Plan (One-time)",
        price: 2000,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Customised Diet Plan",
            "Customised Workout Plan",
            "One-time Consultation"
        ],
        fullDescription: "A perfect starting point for your fitness journey. Get a fully customized diet and workout plan tailored to your specific goals and lifestyle. This is a one-time service designed to give you the blueprint you need to succeed.",
        type: "course"
    },
    {
        id: "guided-transformation",
        title: "GUIDED TRANSFORMATION",
        duration: "Flexible",
        description: "• Weekly Check-ins\n• Monthly Sessions for Consistent Progress",
        price: 4000,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Monthly 1 session (3+1 sessions for 3 months plan)",
            "8 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan"
        ],
        fullDescription: "Get structured guidance with our Guided Transformation plan. Includes weekly check-ins via Google Form to track your progress, a monthly strategy session to refine your plan, and 8 hours of text support for your queries. Perfect for those who need a balance of independence and guidance.",
        type: "course"
    },
    {
        id: "structured-coaching",
        title: "STRUCTURED COACHING",
        duration: "Flexible",
        description: "• Monthly 2 Online Sessions\n• 12 hrs Text Support for Serious Results",
        price: 5500,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Monthly 2 online sessions (6+2 sessions for 3 months plan)",
            "12 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "1 session can be rescheduled if missed"
        ],
        fullDescription: "Step up your game with Structured Coaching. This plan offers more frequent interaction with 2 online sessions per month and 12 hours of text support. Ideal for individuals who want closer monitoring and more dynamic adjustments to their training and nutrition.",
        type: "course"
    },
    {
        id: "elite-1-1-coaching",
        title: "ELITE 1:1 COACHING",
        duration: "Flexible",
        description: "• Weekly Sessions\n• 24hrs Text Support for Ultimate Transformation",
        price: 7000,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Weekly sessions (12+1 sessions for 3 months plan)",
            "24hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "2 sessions can be rescheduled every month if missed"
        ],
        fullDescription: "The ultimate coaching experience. Elite 1:1 Coaching provides maximum accountability with weekly sessions and round-the-clock text support. This is for those who demand the best and are ready to commit fully to their transformation with constant guidance at every step.",
        type: "course"
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

        console.log('All data seeded successfully!');

        console.log('All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
