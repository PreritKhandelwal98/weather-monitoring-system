import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import WeatherSummary from './components/WeatherSummary';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [city, setCity] = useState('Delhi'); // Default to 'Delhi'
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  // A ref to track the previous city value and prevent unnecessary re-renders
  const prevCityRef = useRef();
  const loadingRef = useRef(false);  // A ref to track loading state and avoid re-renders due to state change

  useEffect(() => {
    // Create a flag to prevent state updates if the component is unmounted
    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/weather/summary/${city}`);
        if (isMounted) {
          setWeather({ data: response.data, loading: false, error: false });
          loadingRef.current = false;
        }
      } catch (error) {
        if (isMounted) {
          setWeather({ data: {}, loading: false, error: true });
          loadingRef.current = false;
          console.error('Error fetching weather data:', error);
        }
      }
    };

    // Adding logs to track state changes and API calls
    console.log('useEffect triggered for city:', city);

    // Check if API should be called (only if the city has changed and not currently loading)
    if (prevCityRef.current !== city && !loadingRef.current) {
      console.log('City changed from', prevCityRef.current, 'to', city, '. Fetching new data...');
      prevCityRef.current = city; // Update the ref to store the new city
      loadingRef.current = true;  // Set loading ref to true before making the call
      setWeather({ loading: true, data: {}, error: false }); // Reset state before API call
      fetchWeatherData(); // Fetch new weather data
    }

    return () => {
      isMounted = false;
    };
  }, {}); // Trigger useEffect only when 'city' changes

  return (
    <div className="App">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Weather Monitoring System</h1>

        {/* Dropdown for selecting city */}
        <div className="flex justify-center mb-6">
          <h3 className="mr-2">Get Weather Summary of:</h3>
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

        {weather.loading && <h4>Loading weather data...</h4>}

        {!weather.loading && weather.error && (
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry, unable to retrieve data. Please try again later.
            </span>
          </span>
        )}

        {!weather.loading && !weather.error && (
          <WeatherSummary city={city} summary={weather.data} />
        )}
      </div>
    </div>
  );
}

export default App;
