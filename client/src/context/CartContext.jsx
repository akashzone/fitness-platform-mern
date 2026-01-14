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
            // Business Rule: Courses should have duration info
            let finalProduct = { ...product };
            const options = getDurationOptions();
            const recommended = options.find(o => o.recommended) || options[0];

            // If duration info is missing (e.g. from CourseCard), set defaults
            if (!finalProduct.durationMonths) {
                finalProduct.durationMonths = recommended.months;
                finalProduct.basePrice = product.price; // Store original price

                if (product.isLiveTest) {
                    finalProduct.price = 30;
                    finalProduct.originalPrice = Math.round(30 * 1.2);
                    finalProduct.displayPrice = 30;
                } else {
                    finalProduct.price = Math.round(product.price * recommended.priceMultiplier);
                    finalProduct.originalPrice = Math.round(product.price * recommended.originalPriceMultiplier);
                    finalProduct.displayPrice = finalProduct.price;
                }
            } else if (!finalProduct.basePrice) {
                // It came from CourseDetails with a specific duration
                if (product.isLiveTest) {
                    finalProduct.basePrice = 30;
                    finalProduct.price = 30;
                    finalProduct.displayPrice = 30;
                } else {
                    const currentOpt = options.find(o => o.months === finalProduct.durationMonths);
                    finalProduct.basePrice = Math.round(finalProduct.price / (currentOpt?.priceMultiplier || 1));
                    finalProduct.originalPrice = Math.round(finalProduct.basePrice * (currentOpt?.originalPriceMultiplier || 1.2));
                }
            }

            finalProduct.durations = options;

            // Business Rule: ONLY ONE COURSE ALLOWED IN CART
            // (Ebooks removed, so cart effectively holds only one item now)
            return [finalProduct];
        });
        setIsCartOpen(true);
    };

    const updateCartItemDuration = (productId, newMonths) => {
        setCartItems(prevItems => prevItems.map(item => {
            const isMatch = item.id === productId || item._id === productId;
            if (isMatch) {
                const options = getDurationOptions();
                const newOpt = options.find(o => o.months === newMonths);
                if (newOpt) {
                    if (item.isLiveTest) {
                        return {
                            ...item,
                            durationMonths: newMonths,
                            price: 30,
                            displayPrice: 30
                        };
                    }
                    const newPrice = Math.round(item.basePrice * newOpt.priceMultiplier);
                    const newOriginalPrice = Math.round(item.basePrice * newOpt.originalPriceMultiplier);
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
