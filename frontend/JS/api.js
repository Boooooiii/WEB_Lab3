import axios from 'axios';

const API_URL = 'https://calculator-backend-gyf3.onrender.com/api'; 

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const calcService = {
    async getState(userId) {
        const response = await api.get(`/calculator/${userId}`);
        return response.data;
    },
    async saveState(userId, state) {
        const response = await api.post(`/calculator/${userId}`, state);
        return response.data;
    }
};

export const authService = {
    async login(login, password) {
        const response = await api.post('/auth/login', { login, password });
        return response.data; 
    },
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    async updateProfile(userId, newData) {
        const response = await api.put(`/users/${userId}`, newData);
        return response.data;
    }
};
