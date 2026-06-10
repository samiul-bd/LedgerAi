import axios from 'axios';


const API_URL = 'http://localhost:5044/api'; 

const api = axios.create({
    baseURL: API_URL,
});

// রিকোয়েস্ট পাঠানোর আগে এই ইন্টারসেপ্টরটি কাজ করবে
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;