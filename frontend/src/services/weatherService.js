import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getWeatherSummary = (city) => {
    return axios.get(`${API_URL}/weather/summary/${city}`);
};

// Function to set temperature threshold
export const setThreshold = (data) => {
    return axios.post(`${API_URL}/threshold/set-threshold`, data);
};