import axios from "axios";

const API = axios.create({
  baseURL: "https://shubham-portfolio-api-3i28.onrender.com/api"||"http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
