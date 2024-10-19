import React, { useEffect, useState } from 'react';
import { getWeatherSummary } from '../services/weatherService';
import { Line } from 'react-chartjs-2';

const WeatherSummary = ({ city }) => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const response = await getWeatherSummary(city);
            setSummary(response.data);
        };
        fetchSummary();
    }, [city]);

    if (!summary) return <div>Loading...</div>;

    return (
        <div>
            <h3>{city} Weather Summary</h3>
            <p>Average Temperature: {summary.avg_temp}°C</p>
            <p>Max Temperature: {summary.max_temp}°C</p>
            <p>Min Temperature: {summary.min_temp}°C</p>
            <p>Weather Condition: {summary.weather}</p>

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
