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
        { months: 1, label: "1 Month", priceMultiplier: 1, originalPriceMultiplier: 1.2 },
        { months: 2, label: "2 Months", priceMultiplier: 1.8, originalPriceMultiplier: 2.2 },
        { months: 3, label: "3 Months", priceMultiplier: 2.5, originalPriceMultiplier: 3.5, recommended: true },
        { months: 6, label: "6 Months", priceMultiplier: 4.5, originalPriceMultiplier: 6.5 }
    ]
};

const getDurationOptions = () => DURATION_CONFIG.default;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Removed localStorage persistence as per user request to clear cart on reload

    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Business Rule: Use product specific plans if available, else fallback
            let finalProduct = { ...product };
            const options = product.plans || getDurationOptions();
            const recommended = options.find(o => o.recommended) || options[0];

            // If duration info is missing (e.g. from CourseCard), set defaults
            // We now store the available plans IN the product object in the cart
            finalProduct.durations = options;

            if (!finalProduct.durationMonths) {
                finalProduct.durationMonths = recommended.months;
                finalProduct.basePrice = product.price; // Store original price

                finalProduct.price = Math.round(product.price * (recommended.priceMultiplier || 1));
                finalProduct.originalPrice = Math.round(product.price * (recommended.originalPriceMultiplier || 1.2));
                finalProduct.displayPrice = finalProduct.price;
            } else if (!finalProduct.basePrice) {
                // It came from CourseDetails with a specific duration
                const currentOpt = options.find(o => o.months === finalProduct.durationMonths);
                // If it's a fixed plan (no multiplier), basePrice is just the price
                finalProduct.basePrice = currentOpt.price
                    ? currentOpt.price
                    : Math.round(finalProduct.price / (currentOpt?.priceMultiplier || 1));

                finalProduct.originalPrice = currentOpt.originalPrice
                    ? currentOpt.originalPrice
                    : Math.round(finalProduct.basePrice * (currentOpt?.originalPriceMultiplier || 1.2));
            }

            // Business Rule: ONLY ONE COURSE ALLOWED IN CART
            return [finalProduct];
        });
        setIsCartOpen(true);
    };

    const updateCartItemDuration = (productId, newMonths) => {
        setCartItems(prevItems => prevItems.map(item => {
            const isMatch = item.id === productId || item._id === productId;
            if (isMatch) {
                const options = item.durations || getDurationOptions();
                const newOpt = options.find(o => o.months === newMonths);
                if (newOpt) {
                    const newPrice = newOpt.price
                        ? newOpt.price
                        : Math.round(item.basePrice * newOpt.priceMultiplier);
                    const newOriginalPrice = newOpt.originalPrice
                        ? newOpt.originalPrice
                        : Math.round(item.basePrice * newOpt.originalPriceMultiplier);

                    return {
                        ...item,
                        durationMonths: newMonths,
                        price: newPrice,
                        originalPrice: newOriginalPrice,
                        displayPrice: newPrice
                    };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId && item._id !== productId));
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
