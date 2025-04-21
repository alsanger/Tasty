// Файл services/auth.js
import axios from 'axios';
import {API_BASE_URL, ENDPOINTS} from '../utils/constants';

export const authService = {
    login: async (credentials) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};