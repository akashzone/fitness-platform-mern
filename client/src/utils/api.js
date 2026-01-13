import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || (isLocal ? 'http://localhost:5000' : window.location.origin)}/api`,
});

export default api;
