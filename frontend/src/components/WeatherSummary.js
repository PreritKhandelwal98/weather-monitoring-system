import React, { useEffect, useState } from 'react';
import { getWeatherSummary, setThreshold } from '../services/weatherService';
import ReactAnimatedWeather from "react-animated-weather";

const WeatherSummary = ({ city }) => {
    const [summary, setSummary] = useState(null);
    const [threshold, setThresholdTemp] = useState('');
    const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

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
    }, [city]);

    // Handle threshold submission
    const handleThresholdSubmit = async (e) => {
        e.preventDefault();
        try {
            await setThreshold({
                city,
                tempThreshold: parseFloat(threshold),
            });
            alert(`Threshold set successfully for ${city}`);
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

    // Render loading state
    if (!summary) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="city-name">
                <h2>
                    {city}
                </h2>
            </div>
            <div className="temp">
                <ReactAnimatedWeather icon="CLEAR_DAY" size="50" />
                <p className="temperature">
                    {renderTemperature(summary.avg_temp)}
                    <sup className="temp-deg" onClick={toggleTemperatureUnit}>
                        {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
                    </sup>
                </p>
                <p className="weather-des">{summary.weather}</p>
            </div>

            <div className="weather-info">
                <div className="col">
                    <ReactAnimatedWeather icon="WIND" size="40" />
                    <p className="wind">{summary.wind_speed}m/s</p>
                    <p>Wind speed</p>
                </div>
                <div className="col">
                    <ReactAnimatedWeather icon="RAIN" size="40" />
                    <p className="humidity">{summary.humidity}%</p>
                    <p>Humidity</p>
                </div>
            </div>

            <div className="summary-details">
                <p><strong>Min Temperature:</strong> {renderTemperature(summary.min_temp)}°</p>
                <p><strong>Max Temperature:</strong> {renderTemperature(summary.max_temp)}°</p>
                <p><strong>Average Temperature:</strong> {renderTemperature(summary.avg_temp)}°</p>
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
        </div>
    );
};

export default WeatherSummary;
