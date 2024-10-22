import React, { useEffect, useState } from 'react';
import { getWeatherSummary, setThreshold } from '../services/weatherService';
import ReactAnimatedWeather from "react-animated-weather";
import axios from "axios";
import { toast } from 'react-toastify'

const WeatherSummary = ({ city }) => {
    const [summary, setSummary] = useState(null);
    const [threshold, setThresholdTemp] = useState('');
    const [email, setEmail] = useState(''); // New state for email input
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
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/weather/weather-history/${city}`);
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
                email
            });
            toast.success(`Alert set successfully for ${city}`);
            setThresholdTemp('');
            setEmail(''); // Clear email after submission
        } catch (error) {
            console.error('Error setting threshold:', error);
            toast.error('Failed to set threshold.');
        }
    };

    // Convert temperature
    const convertToFahrenheit = (temperature) => Math.round((temperature * 9) / 5 + 32);

    const renderTemperature = (temperature) => {
        if (temperature == null || isNaN(temperature)) {
            return 'N/A';  // Return "N/A" if temperature is not available
        }
        if (isCelsius) {
            return temperature.toFixed(2); // Show two decimal places in Celsius
        } else {
            return convertToFahrenheit(temperature).toFixed(2); // Show two decimal places in Fahrenheit
        }
    };

    // Toggle temperature unit
    const toggleTemperatureUnit = () => {
        setIsCelsius((prevState) => !prevState);
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
                    <div className="weather-info-row">
                        <div className="weather-info-item">
                            <ReactAnimatedWeather icon="WIND" size="40" />
                            <p className="wind">{renderTemperature(summary.avg_speed)} m/s</p>
                            <p>Wind speed</p>
                        </div>
                        <div className="weather-info-item">
                            <ReactAnimatedWeather icon="RAIN" size="40" />
                            <p className="humidity">{summary.avg_humidity}%</p>
                            <p>Humidity</p>
                        </div>
                    </div>


                    <div className="summary-details">
                        <p><strong>Min Temperature:</strong> {renderTemperature(summary.min_temp)}°C</p>
                        <p><strong>Max Temperature:</strong> {renderTemperature(summary.max_temp)}°C</p>
                        <p><strong>Average Temperature:</strong> {renderTemperature(summary.avg_temp)}°C</p>
                    </div>
                </div>
            </div>
            <small className="info-text">Above is the summarized insights of the city {city} </small>

            {/* Threshold form */}
            <div className="threshold-section">
                <h4>Set Temperature Alert</h4>
                <form onSubmit={handleThresholdSubmit} className="threshold-form">
                    <div className="input-group">
                        <label>Threshold Temperature (°C):</label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThresholdTemp(e.target.value)}
                            required
                            className="threshold-input"
                            placeholder='Enter Temperature'
                        />
                        <br />
                        <label>Get Alert On (Email): </label>
                        <input
                            type="email"
                            value={email} // Use the email state
                            onChange={(e) => setEmail(e.target.value)} // Set email
                            required
                            className="threshold-input"
                            placeholder='Enter Email'
                        />
                    </div>
                    <button type="submit" className="threshold-button">
                        Set Alert
                    </button>
                </form>
            </div>
            <small className="info-text">You can set the alert if certain temperature breaches</small>

            {/* Previous Day's Forecast */}
            <div className="forecast-section">
                <h4>Previous Days Weather Records</h4> {/* Since it's historical data, we reflect that in the title */}
                <div className="forecast-container">
                    {forecast && forecast.map((day, index) => (
                        <div key={index} className="forecast-card">
                            {/* Display the formatted date of each record */}
                            <p className="forecast-day">{new Date(day._id).toLocaleDateString('en-GB')}</p>

                            {/* Display the weather description */}
                            <ReactAnimatedWeather icon={getWeatherIcon(day.weather)} size="30" />

                            {/* Temperature data */}
                            <h4 className="forecast-temp">
                                Average Temp: {renderTemperature(day.avg_temp)}° {isCelsius ? 'C' : 'F'}
                            </h4>

                            {/* Feels like temperature */}
                            <h4 className="forecast-feels">
                                Max Temp: {renderTemperature(day.max_temp)}° {isCelsius ? 'C' : 'F'}
                            </h4>
                            <h4 className="forecast-feels">
                                Min Temp: {renderTemperature(day.min_temp)}° {isCelsius ? 'C' : 'F'}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
            <small className="info-text">The above detail is about previous day's weather history</small>

        </div>
    );
};

export default WeatherSummary;
