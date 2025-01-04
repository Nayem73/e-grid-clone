import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Update this with your backend URL
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
