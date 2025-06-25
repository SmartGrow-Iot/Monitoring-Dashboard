// src/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1", // your Express backend
});

export default api;
