import axios from "axios";

// A clean, interceptor-free Axios cluster dedicated to unauthenticated public endpoints
const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAPI;
