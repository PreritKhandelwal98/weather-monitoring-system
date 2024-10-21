import mongoose from 'mongoose';

const WeatherSummarySchema = new mongoose.Schema({
    city: { type: String, required: true },
    avg_temp: { type: Number, required: true },
    max_temp: { type: Number, required: true },
    min_temp: { type: Number, required: true },
    weather: { type: String, required: true },
    timestamp: { type: Date, default: Date.now } // Automatically store the current date and time
});

const WeatherSummary = mongoose.model('WeatherSummary', WeatherSummarySchema);
export default WeatherSummary;
