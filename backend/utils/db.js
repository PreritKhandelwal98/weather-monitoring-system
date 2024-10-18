import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/config.js';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

// Define the schema for weather data
const weatherSchema = new mongoose.Schema({
    city: String,
    timestamp: { type: Date, default: Date.now },
    weather: String,
    temp: Number,
    feels_like: Number,
});

// Create the Weather model
const Weather = mongoose.model('Weather', weatherSchema);

// Save weather data function (named export)
export const saveWeatherData = async (data) => {
    const weather = new Weather(data);
    await weather.save();
};

// Get daily summary (average, max, min temperature)
export const getDailySummary = async (city) => {
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
                weather: { $first: "$weather" }, // Assuming first weather condition is dominant
            }
        }
    ]);

    return summary[0];
};
