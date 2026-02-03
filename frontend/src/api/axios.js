import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crio-task-manager-wt7r.onrender.com',
});

export default api;
