import axios from 'axios';

const API_URL = 'https://api.com';

export const AXIOS_USER_INSTANCE = axios.create({
  baseURL: `${API_URL}/user`,
  timeout: 1000 * 1 * 60,
});
