import Threshold from '../models/thresholdSchema.js';
import nodemailer from 'nodemailer';


// Check Threshold Breach
// Tracking consecutive breaches for each city
const consecutiveBreaches = {};

// Check if weather data exceeds the user's threshold
export const checkThreshold = async (city, weatherData) => {
    const temp = parseFloat(weatherData.temp);
    console.log("this is threshold temp called", temp);

    // Fetch the threshold for the city from the database
    const threshold = await Threshold.findOne({ city });

    if (!threshold) {
        console.log(`No threshold set for ${city}.`);
        return;
    }

    const userThreshold = threshold.tempThreshold;
    const userEmail = threshold.email;
    console.log("this is temp set by user", userThreshold, userEmail);

    const consecutiveLimit = 2;
    console.log("this is consecutive limit check", consecutiveLimit);


    // Initialize tracking for this city
    if (!consecutiveBreaches[city]) {
        consecutiveBreaches[city] = 0;
    }

    // Check if temperature exceeds threshold
    if (temp > userThreshold) {
        console.log("current temp is greater than the user Threshold temp");

        consecutiveBreaches[city] += 1;
        console.log(`This is breach count: ${consecutiveBreaches[city]} for the city: ${city}`);


        // If the limit is breached for consecutive updates, trigger an alert
        if (consecutiveBreaches[city] >= consecutiveLimit) {
            // Trigger alert (console or email)
            triggerAlert(city, temp, userThreshold, consecutiveLimit, userEmail);
            console.log("alert triggered");


            // Reset the consecutive breach count after alerting
            consecutiveBreaches[city] = 0;
        }
    } else {
        // Reset the breach count if the temperature is below the threshold
        consecutiveBreaches[city] = 0;
    }
};

// Function to trigger alert (email or console)
const triggerAlert = async (city, currentTemp, thresholdTemp, consecutiveLimit, userEmail) => {
    const message = `ALERT: Temperature in ${city} exceeded the threshold of ${thresholdTemp}°C for ${consecutiveLimit} consecutive updates. Current Temperature: ${currentTemp}°C`;

    // Log the alert to the console
    console.log(message);

    // Send an email alert 
    console.log(`alert to ${userEmail} is getting triggred`);

    sendEmailNotification(city, message, userEmail)
};

async function sendEmailNotification(city, message, recipient) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Weather Alert for ${city}`,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${message}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
