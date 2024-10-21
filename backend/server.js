import express from 'express';
import { storeAndProcessWeatherData } from './controllers/weatherController.js';
import cors from 'cors';
import schedule from 'node-schedule';
import weatherRoutes from './routes/weatherSummaryRoute.js';
import thresholdRoutes from './routes/thresholdRoutes.js';
import './utils/db.js';  // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());  // To parse incoming request body as JSON

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/threshold', thresholdRoutes);

// Schedule weather updates every 5 minutes
// schedule.scheduleJob('*/5 * * * *', async () => {
//     console.log("Scheduled job triggered at", new Date().toLocaleString());
//     await storeAndProcessWeatherData();
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
