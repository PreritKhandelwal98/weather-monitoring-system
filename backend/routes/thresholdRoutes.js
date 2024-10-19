import express from 'express';
import Threshold from '../models/thresholdSchema.js';

const router = express.Router();

// Set or update temperature thresholds for a city
router.post('/set-threshold', async (req, res) => {
    const { city, tempThreshold, consecutiveLimit } = req.body;

    try {
        let threshold = await Threshold.findOne({ city });
        if (threshold) {
            threshold.tempThreshold = tempThreshold;
            threshold.consecutiveLimit = consecutiveLimit;
        } else {
            threshold = new Threshold({ city, tempThreshold, consecutiveLimit });
        }

        await threshold.save();
        res.status(200).json({ message: 'Threshold set successfully', threshold });
    } catch (error) {
        res.status(500).json({ message: 'Error setting threshold', error });
    }
});

export default router;
