# Real-Time Weather Monitoring System

## Description

This project is a real-time weather monitoring system that retrieves weather data from the OpenWeatherMap API at regular intervals. It processes the data to compute daily weather summaries, tracks threshold breaches for alerts, and visualizes the historical data and weather trends.

<img width="943" alt="weather-1" src="https://github.com/user-attachments/assets/42c4bf94-6f0a-49cd-8b72-58f85dd0c5c6">

<img width="938" alt="weather-2" src="https://github.com/user-attachments/assets/a71063bd-9ddd-4f73-8e4f-3d43642c6dc6">

<img width="946" alt="weather-3" src="https://github.com/user-attachments/assets/6ce7a2ac-3c3e-4cf4-b02f-557d62861d4d">

### Features:

- Retrieve real-time weather data for six major Indian cities (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad) using OpenWeatherMap API.
- Convert temperatures from Kelvin to Celsius or Fahrenheit (based on user preference).
- Daily aggregates: Average, Max, and Min temperature, and dominant weather condition.
- User-configurable alerts for threshold breaches (e.g., temperature over 35°C).
- Visual representation of daily summaries, trends, and alerts.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [System Design Choices](#system-design-choices)
3. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Setting Up the Backend](#setting-up-the-backend)
   3. [Setting Up the Frontend](#setting-up-the-frontend)
4. [Running the Application](#testing-and-running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Bonus Features](#bonus-features)

---

## Technologies Used

**Backend (Node.js):**

- Node.js (v18.x.x)
- Express.js (v4.x.x)
- Axios (for making API requests)
- MongoDB (for data persistence)
- Nodemailer (for email alerts)

**Frontend (React.js):**

- React.js (v18.x.x)
- Axios (for making API requests to backend)
- Toast Notifications (for displaying alerts)

---

## System Design Choices

1. **Backend:**
   - The backend is built with Node.js and Express to retrieve weather data from the OpenWeatherMap API at a configurable interval (default: every 5 minutes). It processes and stores data in an MongoDB database for daily rollups.
2. **Frontend:**

   - The React.js frontend provides a user interface for real-time data visualization. Users can view weather summaries, set alert thresholds, and check historical trends.

3. **Persistent Storage:**

   - Mongo is used for storing daily summaries and for tracking weather trends over time.

4. **Alerting:**
   - Configurable thresholds for alerts (e.g., temperatures exceeding 35°C for two consecutive intervals). Alerts can be sent via email or displayed in the server console.

---

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

1. **Node.js** (v18.x.x or higher)
2. **npm** (comes with Node.js)
3. **OpenWeatherMap API Key** - [Sign up here](https://home.openweather.co.uk/users/sign_in)

### Setting Up the Backend

1. **Clone the repository:**

```bash
git clone https://github.com/PreritKhandelwal98/weather-monitoring-system.git
cd weather-monitoring-system/backend
```

2. **Install backend dependencies:**

```bash
npm install
```

3. **Create `.env` file for environment variables:**

```bash
touch .env
```

Add the following to `.env`:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
PORT=your_free_port  # Port number which is free
MONGO_URI=your_mongodb_url  # Mongo database connection string
EMAIL_USER=your_email_service_mail_id  # Email for alert notifications
EMAIL_PASS=your_email_service_password
```

4. **Run the backend server:**

```bash
npm start
```

Backend will be running on `http://localhost:${PORT}`.

### Setting Up the Frontend

1. **Navigate to the frontend directory:**

```bash
cd ../frontend
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Run the frontend application:**

```bash
npm start
```

Frontend will be running on `http://localhost:3000`.

---

## Running the Application

1. **Access the application:**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## API Endpoints

- **GET** `/api/weather/summary/:city`: Fetch the current weather summary for a cities.
- **POST** `/api/threshold/set-threshold`: Set or update alert thresholds.
- **GET** `/api/weather/weather-history/${city}`: Get historical data for weather summaries.

---

## Bonus Features

1. **Humidity & Wind Speed Aggregates**:

   - In addition to temperature, the system tracks humidity and wind speed, generating daily rollups and summaries for these parameters.

---

## Additional Notes

- To run the application in production, ensure that all sensitive information (API keys, email credentials) is stored securely using environment variables or secret managers.
- For production use, consider using a more scalable database such as PostgreSQL or MySQL.

---
