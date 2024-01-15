import axios from 'axios';

// from Codeholic vid https://www.youtube.com/watch?v=bHRe5XNP5l8&t=10848s
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

export default axiosClient;
