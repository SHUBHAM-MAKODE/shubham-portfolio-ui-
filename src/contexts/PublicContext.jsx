import React, { createContext, useContext, useState, useEffect } from 'react';
import publicAPI from '../services/publicApi'; // Your configured Axios instances gateway

// 1. Initialize the raw Context broadcast channel
const PublicPortfolioContext = createContext(null);

export const PublicPortfolioProvider = ({ children }) => {
    const [hubData, setHubData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const bootstrapPortfolioData = async () => {
            try {
                setLoading(true);
                // 🌟 Triggering your unified Spring Boot backend aggregator path
                const response = await publicAPI.get('trial/getAll');

                // Extracting data matching your standard ResponseStructure payload mapping
                const payload = response.data?.data || null;
              
                setHubData(payload);
            } catch (err) {
                console.error("🔒 Global Portfolio Context structural sync failed:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        bootstrapPortfolioData();
    }, []);

    return (
        // 2. Broadcast data arrays and loading states across the nested app DOM tree
        <PublicPortfolioContext.Provider value={{ hubData, loading, error }}>
            {children}
        </PublicPortfolioContext.Provider>
    );
};

// 3. Custom high-order Hook to let consumer components intercept data easily
export const usePublicPortfolio = () => {
    const context = useContext(PublicPortfolioContext);
    if (!context) {
        throw new Error("usePublicPortfolio must be executed inside a PublicPortfolioProvider boundary container.");
    }
    return context;
};