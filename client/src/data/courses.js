import foundationImg from '../assets/courses/foundation.jpg';
import foundationCardImg from '../assets/courses/foundation_card.jpg';
import guidedImg from '../assets/courses/guided.jpg';
import structuredImg from '../assets/courses/structured.jpg';
import eliteImg from '../assets/courses/elite.jpg';

export const courses = [
    {
        id: "foundation-plan",
        _id: "foundation-plan",
        title: "FOUNDATION PLAN",
        duration: "One-time",
        description: "• Customised Diet Plan\n• Customised Workout Plan (One-time)",
        price: 990,
        originalPrice: 2000,
        rating: 4.8,
        image: "/images/coaching/card001.jpeg",
        detailImage: "/images/foundation/food011.jpeg",
        mobileDetailImage: "/images/foundation/food011.jpeg",
        executiveSummary: [
            "Designed for individuals who want a clear, science-backed starting point",
            "Focuses on building a strong basic foundation in nutrition and training",
            "Ideal for those who are confident in executing a plan independently"
        ],
        whoThisPlanIsFor: "Beginners or individuals restarting their fitness journey who need a professional blueprint without ongoing coaching or accountability.",
        outcome: "Best for starting strong with a clean plan.",
        features: [
            "Customised Diet Plan",
            "Customised Workout Plan",
            "One-time Consultation"
        ],
        plans: [
            { months: 1, label: "One-time", price: 990, originalPrice: 2000, note: "Standard" }
        ]
    },
    {
        id: "guided-transformation",
        _id: "guided-transformation",
        title: "GUIDED TRANSFORMATION",
        duration: "Flexible",
        description: "• Weekly Check-ins\n• Monthly Sessions for Consistent Progress",
        price: 3990,
        originalPrice: 5000,
        rating: 4.9,
        image: guidedImg,
        detailImage: guidedImg,
        executiveSummary: [
            "Designed for individuals who want structured, result-driven coaching",
            "Focuses on accountability, consistency, and long-term progress",
            "Ideal for those who need periodic monitoring and guided adjustments"
        ],
        whoThisPlanIsFor: "Individuals who want hands-on coaching, accountability, and structured guidance to stay consistent and progress faster.",
        outcome: "Weekly accountability for consistent results.",
        features: [
            "Weekly check-in via google form",
            "Monthly 1 online session",
            "8 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "Total 4 sessions for 3 months plan"
        ],
        plans: [
            { months: 1, label: "1 Month", price: 3990, originalPrice: 5000, note: "High entry" },
            { months: 2, label: "2 Months", price: 7490, originalPrice: 9000, note: "Minor relief" },
            { months: 3, label: "3 Months", price: 11990, originalPrice: 14000, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 19990, originalPrice: 25000, note: "Commitment bonus" }
        ]
    },
    {
        id: "structured-coaching",
        _id: "structured-coaching",
        title: "STRUCTURED COACHING",
        duration: "Flexible",
        description: "• Monthly 2 Online Sessions\n• 12 hrs Text Support for Serious Results",
        price: 5490,
        originalPrice: 6500,
        rating: 4.9,
        image: structuredImg,
        detailImage: structuredImg,
        executiveSummary: [
            "Designed for serious individuals seeking higher professional oversight",
            "Focuses on rapid transformation through close monitoring and technical refinement",
            "Ideal for those requiring deeper strategy and frequent adjustments"
        ],
        whoThisPlanIsFor: "Dedicated individuals who value frequent expert feedback, technical monitoring, and a highly structured approach to bypass plateaus.",
        outcome: "Long-term coaching for serious progress.",
        features: [
            "Weekly check-in via google form",
            "Monthly 2 online sessions",
            "12 hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "1 session can be rescheduled if missed",
            "Total 8 sessions for 3 months plan"
        ],
        plans: [
            { months: 1, label: "1 Month", price: 5490, originalPrice: 6500, note: "Premium entry" },
            { months: 2, label: "2 Months", price: 10490, originalPrice: 13000, note: "Small relief" },
            { months: 3, label: "3 Months", price: 14990, originalPrice: 17500, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 25990, originalPrice: 33000, note: "Serious clients" }
        ]
    },
    {
        id: "elite-1-1-coaching",
        _id: "elite-1-1-coaching",
        title: "ELITE 1:1 COACHING",
        duration: "Flexible",
        description: "• Weekly Sessions\n• 24hrs Text Support for Ultimate Transformation",
        price: 6990,
        originalPrice: 9000,
        rating: 5.0,
        image: eliteImg,
        detailImage: eliteImg,
        executiveSummary: [
            "The ultimate solution for total bodily and lifestyle transformation",
            "Focuses on maximum accountability, mindset mastery, and elite performance",
            "Designed for individuals who demand constant interaction and maximum support"
        ],
        whoThisPlanIsFor: "High-performers and dedicated athletes who demand the highest level of personal involvement, extreme accountability, and peak physical results.",
        outcome: "Maximum attention for fastest transformation.",
        features: [
            "Weekly check-in via google form",
            "Weekly online sessions",
            "24hrs text support",
            "Personalised diet plan",
            "Personalised workout plan",
            "2 sessions can be rescheduled every month",
            "Total 13 sessions for 3 months plan"
        ],
        plans: [
            { months: 1, label: "1 Month", price: 6990, originalPrice: 9000, note: "Premium" },
            { months: 2, label: "2 Months", price: 13490, originalPrice: 17000, note: "Minor save" },
            { months: 3, label: "3 Months", price: 17990, originalPrice: 23000, note: "Best value", recommended: true },
            { months: 6, label: "6 Months", price: 33990, originalPrice: 42000, note: "Long-term elite" }
        ]
    }
];

