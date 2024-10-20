import express from 'express';
import { getDailySummary, weatherHistory } from '../controllers/weatherController.js';

const router = express.Router();

// Get daily weather summary for a city
router.get('/summary/:city', async (req, res) => {
    const city = req.params.city;
    console.log('City:', city);

    try {
        const summary = await getDailySummary(city);

        if (summary) {
            res.json(summary);
        } else {
            res.status(404).json({ message: `No summary found for city: ${city}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data.', error: error.message });
    }
});

router.get('/weather-history/:city', weatherHistory);


export default router;
