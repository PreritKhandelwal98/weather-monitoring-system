import mongoose from 'mongoose';

// Define the schema for weather data
const weatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    timestamp: { type: Date },
    weather: { type: String, required: true },
    temp: { type: Number, required: true },
    speed: { type: Number },
    humidity: { type: Number },
    feels_like: { type: Number, required: true },
});

// Create the Weather model
const Weather = mongoose.model('Weather', weatherSchema);

// Save weather data function
export const saveWeatherData = async (data) => {
    const weather = new Weather(data);
    await weather.save();
};

// Export the Weather model as the default export
export default Weather;  // Ensure this is a default export
