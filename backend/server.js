import express from 'express';
import { storeAndProcessWeatherData } from './controllers/weatherController.js'; // Ensure this is the correct import
import { getDailySummary } from './utils/db.js'; // Import the function directly
import schedule from 'node-schedule';
import cors from 'cors';

const app = express();
app.use(cors());

// Endpoint to get the daily weather summary for a city
app.get('/weather-summary/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const summary = await getDailySummary(city); // Call the function directly
        console.log(summary);

        res.json(summary);
    } catch (error) {
        res.status(500).send('Error retrieving data.');
    }
});

// Schedule weather updates every 5 minutes
schedule.scheduleJob('*/5 * * * *', async () => {
    console.log("Scheduled job triggered at", new Date().toLocaleString());
    await storeAndProcessWeatherData();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
