import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DJANGO_API_URL,
    withCredentials: true,
});

export default api;