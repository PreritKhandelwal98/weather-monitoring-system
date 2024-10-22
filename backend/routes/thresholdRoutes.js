import express from 'express';
import Threshold from '../models/thresholdSchema.js';

const router = express.Router();

// Set or update temperature thresholds for a city
router.post('/set-threshold', async (req, res) => {
    const { city, tempThreshold, email, consecutiveLimit = 2 } = req.body; // Use default for consecutiveLimit if not provided

    console.log("POST request received:", city, tempThreshold, email);

    try {
        let threshold = await Threshold.findOne({ city });
        if (threshold) {
            // If a threshold exists, update the existing entry
            threshold.tempThreshold = tempThreshold;
            threshold.email = email; // Update the email as well
            threshold.consecutiveLimit = consecutiveLimit;
        } else {
            // If no existing threshold, create a new one
            console.log("Creating a new threshold entry");

            threshold = new Threshold({
                city,
                tempThreshold,
                consecutiveLimit, // Add consecutiveLimit here as well
                email
            });
            console.log("New threshold created:", threshold);
        }

        // Save to the database
        await threshold.save();

        res.status(200).json({ message: 'Threshold set successfully', threshold });
    } catch (error) {
        console.error("Error setting threshold:", error);
        res.status(500).json({ message: 'Error setting threshold', error });
    }
});


export default router;
