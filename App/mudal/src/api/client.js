import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.1.43:5000/api',
  timeout: 10000,
});

export default client;