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
        // Get the current date and calculate the start and end of the day (midnight to 11:59:59)
        const today = new Date();
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

        console.log("This is start of day in UTC:", startOfDay);  // This will now correctly show the start of today in UTC
        console.log("This is end of day in UTC:", endOfDay);      // This will now correctly show the end of today in UTC



        // Aggregate weather data only for the current day
        const summary = await Weather.aggregate([
            {
                $match: {
                    city: city,
                    timestamp: { $gte: startOfDay, $lte: endOfDay }, // Match timestamps within today's range
                }
            },
            {
                $group: {
                    _id: null,
                    avg_temp: { $avg: "$temp" }, // Calculate the average temperature
                    max_temp: { $max: "$temp" }, // Get the maximum temperature
                    min_temp: { $min: "$temp" }, // Get the minimum temperature
                    // Group weather descriptions; for example, you can take the most common one or just the first
                    weather: { $first: "$weather" }, // Take the first recorded weather description for simplicity
                }
            }
        ]);

        // Return the summary or handle the case where no data is found for the current day
        if (summary.length > 0) {
            console.log('Weather summary for today:', summary[0]);
            return summary[0];
        } else {
            console.log(`No data found for ${city} today`);
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
        // Aggregate data by day and calculate average, max, and min temps for each day
        const weatherData = await Weather.aggregate([
            {
                $match: { city: city } // Match the specific city
            },
            {
                // Convert timestamp to date only (ignores time)
                $project: {
                    city: 1,
                    temp: 1,
                    weather: 1,
                    timestamp: 1,
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } } // Get date only (YYYY-MM-DD)
                }
            },
            {
                // Group by date to aggregate the weather data for each day
                $group: {
                    _id: "$date", // Group by the date (YYYY-MM-DD)
                    avg_temp: { $avg: "$temp" }, // Calculate average temperature
                    max_temp: { $max: "$temp" }, // Find the maximum temperature
                    min_temp: { $min: "$temp" }, // Find the minimum temperature
                    weather: { $first: "$weather" }, // You can adjust this to how you want to handle weather conditions
                    timestamp: { $first: "$timestamp" } // Capture a representative timestamp for sorting
                }
            },
            {
                // Sort by the date in descending order (latest first)
                $sort: { _id: -1 }
            },
            {
                // Limit to the last 4 days of weather data
                $limit: 4
            }
        ]);

        if (weatherData.length === 0) {
            return res.status(404).json({ message: `No data found for city: ${city}` });
        }

        res.json(weatherData); // Send the aggregated weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

