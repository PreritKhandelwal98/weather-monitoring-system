import Threshold from '../models/thresholdSchema.js';
import nodemailer from 'nodemailer';

// Trigger Alert (Console or Email)
async function triggerAlert(city, message) {
    console.log(`ALERT for ${city}: ${message}`);

    // Send email alert if enabled
    const threshold = await Threshold.findOne({ city });
    if (threshold && threshold.emailAlert) {
        sendEmailNotification(city, message, threshold.recipient);
    }
}

// Email Notification
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

// Check Threshold Breach
export async function checkThreshold(city, weatherData) {
    const threshold = await Threshold.findOne({ city });
    if (!threshold) return;  // Exit if no threshold set for the city

    const temp = parseFloat(weatherData.temp);
    if (temp > threshold.tempThreshold) {
        // Handle consecutive breaches logic (as per the model)
        if (!threshold.consecutiveBreaches) {
            threshold.consecutiveBreaches = 1;
        } else {
            threshold.consecutiveBreaches += 1;
        }

        if (threshold.consecutiveBreaches >= threshold.consecutiveLimit) {
            triggerAlert(city, `Temperature exceeded ${threshold.tempThreshold}°C for ${threshold.consecutiveLimit} consecutive updates.`);
            threshold.consecutiveBreaches = 0;  // Reset after alert
        }
    } else {
        threshold.consecutiveBreaches = 0;  // Reset if below threshold
    }

    await threshold.save();
}
