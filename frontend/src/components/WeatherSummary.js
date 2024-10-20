import React, { useEffect, useState } from 'react';
import { getWeatherSummary, setThreshold } from '../services/weatherService';
import ReactAnimatedWeather from "react-animated-weather";
import axios from "axios";
import { toast } from 'react-toastify'

const WeatherSummary = ({ city }) => {
    const [summary, setSummary] = useState(null);
    const [threshold, setThresholdTemp] = useState('');
    const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit
    const [forecast, setForecast] = useState([]); // 5-day forecast data

    // Fetch weather summary when city changes
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await getWeatherSummary(city);
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };
        fetchSummary();

        const fetchForecast = async () => {
            try {
                // Sample API for a 5-day weather forecast
                const response = await axios.get(`http://localhost:5000/api/weather/weather-history/${city}`);
                console.log("this is history response", response.data);

                setForecast(response.data); // Take the first 5 days
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };
        fetchForecast();
    }, [city]);

    // Handle threshold submission
    const handleThresholdSubmit = async (e) => {
        e.preventDefault();
        try {
            await setThreshold({
                city,
                tempThreshold: parseFloat(threshold),
            });
            toast.success(`Threshold set successfully for ${city}`);
        } catch (error) {
            console.error('Error setting threshold:', error);
            alert('Failed to set threshold.');
        }
    };

    // Convert temperature
    const convertToFahrenheit = (temperature) => Math.round((temperature * 9) / 5 + 32);

    const renderTemperature = (temperature) => {
        if (isCelsius) {
            return Math.round(temperature);
        } else {
            return convertToFahrenheit(temperature);
        }
    };

    // Toggle temperature unit
    const toggleTemperatureUnit = () => {
        setIsCelsius((prevState) => !prevState);
    };

    // Function to format the date and time
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            weekday: 'short', // "Mon", "Tue", etc.
            hour: 'numeric',  // "1 PM", "12 AM", etc.
            minute: 'numeric', // "1:30 PM"
            hour12: true,     // Use 12-hour format
        });
    };

    // Function to map weather conditions to ReactAnimatedWeather icon names
    const getWeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear':
            case 'sunny':
                return 'CLEAR_DAY';
            case 'haze':
            case 'fog':
            case 'smoke':
                return 'FOG';
            case 'rain':
            case 'drizzle':
            case 'showers':
                return 'RAIN';
            case 'snow':
                return 'SNOW';
            case 'cloudy':
            case 'overcast':
                return 'CLOUDY';
            case 'thunderstorm':
            case 'lightning':
                return 'SLEET'; // You can use 'SLEET' or 'WIND'
            default:
                return 'PARTLY_CLOUDY_DAY'; // Default icon if condition doesn't match
        }
    };



    // Render loading state
    if (!summary) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="city-name">
                <h2>{city}</h2>
            </div>
            <div className="weather-card-container">
                <div className="weather-card">
                    <div className="temp">
                        <ReactAnimatedWeather icon={getWeatherIcon(summary.weather)} size="50" />
                        <div className="temperature-info">
                            <p className="temperature">
                                {renderTemperature(summary.avg_temp)}°
                                <sup className="temp-deg" onClick={toggleTemperatureUnit}>
                                    {isCelsius ? "C" : "F"} | {isCelsius ? "F" : "C"}
                                </sup>
                            </p>
                            <p className="weather-des">{summary.weather}</p>
                        </div>
                    </div>
                    <div className="summary-details">
                        <p><strong>Min Temperature:</strong> {renderTemperature(summary.min_temp)}°C</p>
                        <p><strong>Max Temperature:</strong> {renderTemperature(summary.max_temp)}°C</p>
                        <p><strong>Average Temperature:</strong> {renderTemperature(summary.avg_temp)}°C</p>
                    </div>
                </div>
            </div>

            {/* Threshold form */}
            <div className="threshold-section">
                <h4>Set Temperature Threshold</h4>
                <form onSubmit={handleThresholdSubmit} className="threshold-form">
                    <div className="input-group">
                        <label>Threshold Temperature (°C):</label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThresholdTemp(e.target.value)}
                            required
                            className="threshold-input"
                        />
                    </div>
                    <button type="submit" className="threshold-button">
                        Set Threshold
                    </button>
                </form>
            </div>


            {/* 5-Day Forecast */}
            <div className="forecast-section">
                <h4>Last 4 Weather Records</h4> {/* Since it's historical data, we reflect that in the title */}
                <div className="forecast-container">
                    {forecast && forecast.map((day, index) => (
                        <div key={index} className="forecast-card">
                            {/* Display the formatted date of each record */}
                            <p className="forecast-day">{formatDateTime(day.timestamp)}</p>

                            {/* Display the weather description */}
                            <ReactAnimatedWeather icon={getWeatherIcon(day.weather)} size="50" />

                            {/* Temperature data */}
                            <p className="forecast-temp">
                                Temp: {renderTemperature(day.temp)}° {isCelsius ? 'C' : 'F'}
                            </p>

                            {/* Feels like temperature */}
                            <p className="forecast-feels">
                                Feels like: {renderTemperature(day.feels_like)}° {isCelsius ? 'C' : 'F'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default WeatherSummary;
