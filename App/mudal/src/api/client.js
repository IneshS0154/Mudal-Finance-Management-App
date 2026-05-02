import axios from 'axios';

const client = axios.create({
  // Use environment variable for production/hosting, fallback to local IP for dev
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.134:5001/api',
});

export default client;