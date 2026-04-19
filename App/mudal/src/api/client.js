import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

export default client;