import fetch from 'node-fetch';
import { API_KEY, CITIES } from '../utils/config.js';
import { saveWeatherData } from '../models/weatherSchema.js'; // Keep this as a named import
import Weather from '../models/weatherSchema.js'; // Import Weather as a default import
import { checkThreshold } from './thresholdController.js';

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
        timestamp: new Date(data.dt * 1000),
    };
}

// Store and Process Weather Data
export async function storeAndProcessWeatherData() {
    for (const city of CITIES) {
        try {
            const weatherData = await fetchWeatherData(city);
            console.log("Weather data:", weatherData);

            // Save weather data to MongoDB
            await saveWeatherData(weatherData);
            console.log("Data saved in the database");


            // Check for temperature threshold breach
            console.log("this is before threshold check");

            await checkThreshold(city, weatherData);
            console.log("this is after threshold check");

        } catch (err) {
            console.error(`Error fetching data for ${city}:`, err);
        }
    }
}

// Get daily summary (average, max, min temperature)
export const getDailySummary = async (city) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const summary = await Weather.aggregate([
            {
                $match: {
                    city: city,
                    timestamp: { $gte: startOfDay },
                }
            },
            {
                $group: {
                    _id: null,
                    avg_temp: { $avg: "$temp" },
                    max_temp: { $max: "$temp" },
                    min_temp: { $min: "$temp" },
                    weather: { $first: "$weather" },
                }
            }
        ]);

        if (summary.length > 0) {
            console.log('Weather summary:', summary[0]);
            return summary[0];
        } else {
            console.log(`No data found for ${city}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        throw error;
    }
};

export const weatherHistory = async (req, res) => {
    const { city } = req.params;
    try {
        // Fetch the latest 5 weather records for the city
        const weatherData = await Weather.find({ city })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
            .limit(4); // Limit to the last 5 records

        if (weatherData.length === 0) {
            return res.status(404).json({ message: `No data found for city: ${city}` });
        }

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
