import axios from 'axios';

// Automatically use Render in production, localhost in dev
const BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://full-react.onrender.com/api'
    : 'http://localhost:5000/api';

const API = axios.create({
    baseURL: BASE_URL,
});

// Automatically attach the auth token to requests if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const authApi = {
    login: (credentials) => API.post('/auth/login', credentials),
    signup: (userData) => API.post('/auth/register', userData),
    getCurrentUser: () => API.get('/auth/me'),
    sendOtp: (email) => API.post('/auth/send-otp', { email }),
    verifyOtp: (email, token) => API.post('/auth/verify-otp', { email, token }),
    setPassword: (email, password, username) => API.post('/auth/set-password', { email, password, username }),
    updateProfile: (username, password) => API.put('/auth/update-profile', { username, password }),
};
const API_BASE_URL = BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};



export const generatorApi = {
    generateCode: (schema) => request('/generate', { method: 'POST', body: JSON.stringify({ schema }) }),
};

export const projectApi = {
    saveProject: (projectData) => request('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
    getPublicProjects: () => request('/projects/public'),
    getProjectById: (id) => request(`/projects/${id}`),
    getMyProjects: () => request('/projects/my-projects'),
};