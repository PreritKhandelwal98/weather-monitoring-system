import fetch from 'node-fetch';
import { API_KEY, CITIES } from '../utils/config.js';
import { saveWeatherData } from '../utils/db.js'; // MongoDB setup

// Convert Kelvin to Celsius
const kelvinToCelsius = (tempK) => (tempK - 273.15).toFixed(2);

// Fetch weather data for each city
async function fetchWeatherData(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return {
        city: city,
        weather: data.weather[0].main,
        temp: kelvinToCelsius(data.main.temp),
        feels_like: kelvinToCelsius(data.main.feels_like),
        timestamp: new Date(data.dt * 1000), // Convert Unix timestamp to JS Date object
    };
}

// Store data in MongoDB and calculate rollups
export async function storeAndProcessWeatherData() {
    for (const city of CITIES) {
        try {
            const weatherData = await fetchWeatherData(city);
            console.log("this is weather data frpm weather controller", weatherData);

            await saveWeatherData(weatherData); // Use the imported saveWeatherData function
        } catch (err) {
            console.error(`Error fetching data for ${city}:`, err);
        }
    }
}
