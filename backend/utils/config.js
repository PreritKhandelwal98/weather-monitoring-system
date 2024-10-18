import dotenv from 'dotenv';
dotenv.config();

export const API_KEY = process.env.OPENWEATHER_API_KEY;
export const MONGO_URI = process.env.MONGO_URI;
export const CITIES = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];
export const INTERVAL = 300000; // 5 minutes in milliseconds
