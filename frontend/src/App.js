import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherSummary from './components/WeatherSummary';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [city, setCity] = useState('Delhi'); // Default to 'Delhi'
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  // Trigger API call whenever city is changed
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Your backend API call to fetch weather summary based on city
        const response = await axios.get(`http://localhost:5000/api/weather/summary/${city}`);
        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
        console.error('Error fetching weather data:', error);
      }
    };

    if (city) {
      setWeather({ ...weather, loading: true });  // Set loading to true before fetching
      fetchWeatherData();
    }
  }, [city]); // Call API when 'city' changes

  return (
    <div className="App">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Weather Monitoring System</h1>

        {/* Dropdown for selecting city */}
        <div className="flex justify-center mb-6">
          <h3 className="mr-2">Get Weather Summary of:</h3> {/* Add margin-right to the h4 */}
          <select
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>

        {/* Display loading message */}
        {weather.loading && (
          <h4>Loading weather data...</h4>
        )}

        {/* Error handling */}
        {!weather.loading && weather.error && (
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry, unable to retrieve data. Please try again later.
            </span>
          </span>
        )}

        {/* Weather summary component */}
        {!weather.loading && !weather.error && (
          <WeatherSummary city={city} summary={weather.data} />
        )}
      </div>
    </div>
  );
}

export default App;
