import React, { useEffect, useState } from 'react';
import { getWeatherSummary, setThreshold } from '../services/weatherService'; // Import the setThreshold function
import { Line } from 'react-chartjs-2';

const WeatherSummary = ({ city }) => {
    const [summary, setSummary] = useState(null);
    const [threshold, setThresholdTemp] = useState('');  // For the input value
    const [consecutiveLimit, setConsecutiveLimit] = useState(2);  // Optional consecutive limit

    useEffect(() => {
        const fetchSummary = async () => {
            const response = await getWeatherSummary(city);
            setSummary(response.data);
        };
        fetchSummary();
    }, [city]);

    const handleThresholdSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call your API to set the threshold
            const response = await setThreshold({
                city,
                tempThreshold: parseFloat(threshold),
            });
            alert(`Threshold set successfully for ${city}`);
        } catch (error) {
            console.error('Error setting threshold:', error);
            alert('Failed to set threshold.');
        }
    };

    if (!summary) return <div>Loading...</div>;

    return (
        <div>
            <h3>{city} Weather Summary</h3>
            <p>Average Temperature: {summary.avg_temp}°C</p>
            <p>Max Temperature: {summary.max_temp}°C</p>
            <p>Min Temperature: {summary.min_temp}°C</p>
            <p>Weather Condition: {summary.weather}</p>

            {/* Threshold form */}
            <div>
                <h4>Set Temperature Threshold</h4>
                <form onSubmit={handleThresholdSubmit}>
                    <label>
                        Threshold Temperature (°C):
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThresholdTemp(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Set Threshold</button>
                </form>
            </div>

            {/* Example chart (using random data) */}
            {/* <Line
                data={{
                    labels: ['1AM', '2AM', '3AM', '4AM'], // Example timestamps
                    datasets: [{
                        label: 'Temperature',
                        data: [22, 23, 25, 20],
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false
                    }]
                }}
            /> */}
        </div>
    );
};

export default WeatherSummary;
