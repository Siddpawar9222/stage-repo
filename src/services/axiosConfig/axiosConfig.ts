import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance with base URL
const axiosConfig = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Or wherever you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional, for handling errors or responses globally)
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally, e.g., redirect to login if unauthorized
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized (e.g., redirect to login)
      console.error('Unauthorized access. Redirecting to login.');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;