import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log('MongoDB connection error:', err));
