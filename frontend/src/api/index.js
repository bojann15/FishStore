import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: false,
    headers: {
        "Content-type": "application/json",

    }
});

export default API;