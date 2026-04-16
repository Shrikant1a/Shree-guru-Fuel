import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fuelService = {
    getPrices: () => api.get('/fuel/prices'),
    updatePrice: (fuelData) => api.post('/fuel/update', fuelData),
};

export const requestService = {
    submitRequest: (requestData) => api.post('/requests/submit', requestData),
    getAllRequests: () => api.get('/requests/all'),
    updateStatus: (id, status) => api.put(`/requests/${id}/status?status=${status}`),
};

export default api;
