import axios from "axios";

// A clean, interceptor-free Axios cluster dedicated to unauthenticated public endpoints
const publicAPI = axios.create({
  baseURL:
    "https://shubham-portfolio-api-3i28.onrender.com/api" ||
    "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAPI;
