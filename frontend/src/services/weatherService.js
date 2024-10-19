import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getWeatherSummary = (city) => {
    return axios.get(`${API_URL}/api/weather/summary/${city}`);
};
