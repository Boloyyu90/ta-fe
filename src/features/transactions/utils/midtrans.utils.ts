/**
 * Midtrans Utilities
 */

const MIDTRANS_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const MIDTRANS_PRODUCTION_URL = 'https://app.midtrans.com/snap/snap.js';

let isLoading = false;
let isLoaded = false;

/**
 * Load Midtrans Snap script dynamically
 */
export const loadMidtransSnap = (clientKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (isLoaded && window.snap) {
            resolve();
            return;
        }

        if (isLoading) {
            const checkInterval = setInterval(() => {
                if (isLoaded && window.snap) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            return;
        }

        isLoading = true;

        // Use sandbox for development
        const isProduction = process.env.NODE_ENV === 'production';
        const scriptUrl = isProduction ? MIDTRANS_PRODUCTION_URL : MIDTRANS_SANDBOX_URL;

        const existingScript = document.querySelector(`script[src*="midtrans"]`);
        if (existingScript) {
            isLoaded = true;
            isLoading = false;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;

        script.onload = () => {
            isLoaded = true;
            isLoading = false;
            resolve();
        };

        script.onerror = () => {
            isLoading = false;
            reject(new Error('Gagal memuat Midtrans Snap'));
        };

        document.body.appendChild(script);
    });
};

/**
 * Format price to Indonesian Rupiah
 *
 * Example: 150000 → "Rp 150.000"
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

/**
 * Check if transaction is still payable
 */
export const isTransactionPayable = (status: string, expiredAt: string | null): boolean => {
    if (status !== 'PENDING') return false;
    if (!expiredAt) return true;
    return new Date(expiredAt) > new Date();
};
