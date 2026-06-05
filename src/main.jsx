import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import { PublicPortfolioProvider } from './contexts/PublicContext'; // Importing your global context provider
import { BrowserRouter } from 'react-router';

let root = ReactDom.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <PublicPortfolioProvider>
            <App />
        </PublicPortfolioProvider>
    </BrowserRouter>
);