/**
 * Google Analytics 4 tracking utility
 */

const MEASUREMENT_ID = 'G-ZVQDEVK1Y0';

export const trackPageView = (path) => {
    // Only track in production and if gtag is available
    if (
        import.meta.env.PROD &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' &&
        typeof window.gtag === 'function'
    ) {
        window.gtag('config', MEASUREMENT_ID, {
            page_path: path,
        });
    }
};
