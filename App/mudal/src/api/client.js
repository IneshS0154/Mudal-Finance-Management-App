import axios from 'axios';

export function getApiErrorMessage(err, fallback = 'Something went wrong') {
  const msg = err.response?.data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;

  if (err.code === 'ECONNABORTED' || /timeout/i.test(err.message || '')) {
    return 'Request timed out. Is the backend running on port 5001?';
  }

  if (!err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK')) {
    return 'Cannot reach the API. Set EXPO_PUBLIC_API_URL in App/mudal/.env to http://YOUR_PC_LAN_IP:5001/api (same Wi‑Fi as the phone). Android emulator: http://10.0.2.2:5001/api. Then restart Expo.';
  }

  if (!err.response && err.message) return err.message;
  return fallback;
}

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.134:5001/api',
  timeout: 25_000,
  headers: { 'Content-Type': 'application/json' },
});

export default client;
