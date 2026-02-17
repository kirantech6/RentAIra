import React, { createContext, useContext, useState, useEffect } from 'react';

const LocaleContext = createContext();

export const useLocale = () => {
    return useContext(LocaleContext);
};

export const LocaleProvider = ({ children }) => {
    // Default to USA
    const [locale, setLocale] = useState('US');

    // Currency symbols and codes
    const currencies = {
        'US': { symbol: '$', code: 'USD', name: 'USA', flag: '🇺🇸' },
        'UK': { symbol: '£', code: 'GBP', name: 'UK', flag: '🇬🇧' },
        'IN': { symbol: '₹', code: 'INR', name: 'India', flag: '🇮🇳' },
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        const { code, symbol } = currencies[locale];

        // Simple conversion simulation (Rates as of approx Oct 2023)
        let convertedAmount = amount;
        if (locale === 'UK') {
            convertedAmount = amount * 0.82;
        } else if (locale === 'IN') {
            convertedAmount = amount * 83.0;
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(convertedAmount);
    };

    const value = {
        locale,
        setLocale,
        currentCurrency: currencies[locale],
        formatCurrency,
        availableLocales: currencies
    };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};
