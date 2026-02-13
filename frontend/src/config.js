const isProduction = process.env.NODE_ENV === 'production';

// The URL from your Render deployment
const PROD_BACKEND_URL = 'https://keylogger-main.onrender.com';

const getBackendUrl = () => {
    const envUrl = process.env.REACT_APP_BACKEND_URL;

    if (isProduction) {
        // If in production, and env var is missing or localhost, use hardcoded Render URL
        if (!envUrl || envUrl.includes('localhost')) {
            return PROD_BACKEND_URL;
        }
    }

    // Default to env var or localhost for development
    return envUrl || 'http://localhost:8000';
};

export const BACKEND_URL = getBackendUrl();
export const API = `${BACKEND_URL}/api`;
