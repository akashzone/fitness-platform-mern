import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

const DURATION_CONFIG = {
    "default": [
        { months: 1, label: "1 Month", priceMultiplier: 1 },
        { months: 2, label: "2 Months", priceMultiplier: 1.8 },
        { months: 3, label: "3 Months", priceMultiplier: 2.5, recommended: true },
        { months: 6, label: "6 Months", priceMultiplier: 4.5 }
    ]
};

const getDurationOptions = () => DURATION_CONFIG.default;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const isCourse = product.type === 'course';

            // Business Rule: Courses should have duration info
            let finalProduct = { ...product };
            if (isCourse) {
                const options = getDurationOptions();
                const recommended = options.find(o => o.recommended) || options[0];

                // If duration info is missing (e.g. from CourseCard), set defaults
                if (!finalProduct.durationMonths) {
                    finalProduct.durationMonths = recommended.months;
                    finalProduct.basePrice = product.price; // Store original price
                    finalProduct.price = Math.round(product.price * recommended.priceMultiplier);
                    finalProduct.displayPrice = finalProduct.price;
                } else if (!finalProduct.basePrice) {
                    // It came from CourseDetails with a specific duration
                    // We need to figure out its base price to allow future changes
                    const currentOpt = options.find(o => o.months === finalProduct.durationMonths);
                    finalProduct.basePrice = Math.round(finalProduct.price / (currentOpt?.priceMultiplier || 1));
                }

                finalProduct.durations = options;

                const otherItems = prevItems.filter(item => item.type !== 'course');
                return [...otherItems, finalProduct];
            }

            // Ebooks: Multiple allowed, but avoid duplicates
            if (prevItems.find(item => item._id === product._id)) {
                return prevItems;
            }

            return [...prevItems, finalProduct];
        });
        setIsCartOpen(true);
    };

    const updateCartItemDuration = (productId, newMonths) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item._id === productId && item.type === 'course') {
                const options = getDurationOptions();
                const newOpt = options.find(o => o.months === newMonths);
                if (newOpt) {
                    const newPrice = Math.round(item.basePrice * newOpt.priceMultiplier);
                    return {
                        ...item,
                        durationMonths: newMonths,
                        price: newPrice,
                        displayPrice: newPrice
                    };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateCartItemDuration,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
