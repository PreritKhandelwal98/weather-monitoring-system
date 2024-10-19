// frontend/src/App.js
import React, { useState } from 'react';
import WeatherSummary from './components/WeatherSummary';

function App() {
  const [city, setCity] = useState('Delhi');

  return (
    <div className="App">
      <h1>Weather Monitoring System</h1>
      <select onChange={(e) => setCity(e.target.value)} value={city}>
        <option value="Delhi">Delhi</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Chennai">Chennai</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Kolkata">Kolkata</option>
        <option value="Hyderabad">Hyderabad</option>
      </select>
      <WeatherSummary city={city} />
    </div>
  );
}

export default App;
