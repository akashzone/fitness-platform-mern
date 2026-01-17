export const courses = [
    {
        id: "foundation-plan",
        _id: "foundation-plan",
        title: "FOUNDATION PLAN",
        duration: "One-time",
        description: "• Customised Diet Plan\n• Customised Workout Plan (One-time)",
        price: 2000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Customised Diet Plan",
            "Customised Workout Plan",
            "One-time Consultation"
        ],
        fullDescription: [
            "A perfect starting point for your fitness journey to build a strong foundation.",
            "Get a fully customized diet and workout plan tailored to your specific goals and lifestyle.",
            "This is a one-time service designed to give you the blueprint you need to succeed without ongoing commitment."
        ],
        plans: [
            { months: 1, label: "One-time", price: 2000, originalPrice: 2400, note: "Standard" }
        ]
    },
    {
        id: "guided-transformation",
        _id: "guided-transformation",
        title: "GUIDED TRANSFORMATION",
        duration: "Flexible",
        description: "• Weekly Check-ins\n• Monthly Sessions for Consistent Progress",
        price: 4000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Monthly 1 session (3+1 sessions for 3 months plan)",
            "8 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan"
        ],
        fullDescription: [
            "Get structured guidance with our Guided Transformation plan for consistent progress.",
            "Includes weekly check-ins via Google Form to track your progress and keep you accountable.",
            "A monthly strategy session to refine your plan and address challenges.",
            "8 hours of text support for your queries. Perfect for a balance of independence and guidance."
        ],
        plans: [
            { months: 1, label: "1 Month", price: 4000, originalPrice: 5000, note: "High entry" },
            { months: 2, label: "2 Months", price: 7500, originalPrice: 9000, note: "Minor relief" },
            { months: 3, label: "3 Months", price: 11000, originalPrice: 14000, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 20000, originalPrice: 25000, note: "Commitment bonus" }
        ]
    },
    {
        id: "structured-coaching",
        _id: "structured-coaching",
        title: "STRUCTURED COACHING",
        duration: "Flexible",
        description: "• Monthly 2 Online Sessions\n• 12 hrs Text Support for Serious Results",
        price: 5500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Monthly 2 online sessions (6+2 sessions for 3 months plan)",
            "12 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "1 session can be rescheduled if missed"
        ],
        fullDescription: [
            "Step up your game with Structured Coaching for serious results.",
            "Offers more frequent interaction with 2 online sessions per month.",
            "12 hours of text support for real-time guidance and adjustments.",
            "Ideal for individuals who want closer monitoring and dynamic adjustments to their training."
        ],
        plans: [
            { months: 1, label: "1 Month", price: 5500, originalPrice: 6500, note: "Premium entry" },
            { months: 2, label: "2 Months", price: 10500, originalPrice: 13000, note: "Small relief" },
            { months: 3, label: "3 Months", price: 14000, originalPrice: 17500, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 26000, originalPrice: 33000, note: "Serious clients" }
        ]
    },
    {
        id: "elite-1-1-coaching",
        _id: "elite-1-1-coaching",
        title: "ELITE 1:1 COACHING",
        duration: "Flexible",
        description: "• Weekly Sessions\n• 24hrs Text Support for Ultimate Transformation",
        price: 7000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
        features: [
            "Weekly check-in via google form",
            "Weekly sessions (12+1 sessions for 3 months plan)",
            "24hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "2 sessions can be rescheduled every month if missed"
        ],
        fullDescription: [
            "The ultimate coaching experience providing maximum accountability.",
            "Elite 1:1 Coaching with weekly sessions for deep-dive strategy and mindset.",
            "Round-the-clock (24hrs) text support for instant feedback and motivation.",
            "For those who demand the best and are ready to commit fully with constant guidance."
        ],
        plans: [
            { months: 1, label: "1 Month", price: 7000, originalPrice: 9000, note: "Premium" },
            { months: 2, label: "2 Months", price: 13500, originalPrice: 17000, note: "Minor save" },
            { months: 3, label: "3 Months", price: 18000, originalPrice: 23000, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 34000, originalPrice: 42000, note: "Long-term elite" }
        ]
    }
];
