import axios from 'axios';

export const getWeatherSummary = (city) => {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/weather/summary/${city}`);
};

// Function to set temperature threshold
export const setThreshold = (data) => {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/threshold/set-threshold`, data);
};