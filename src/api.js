import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchStartups = async () => {
  try {
    const response = await api.get('/startups');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addInvestment = async (data) => {
  try {
    const response = await api.post('/startups', data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};