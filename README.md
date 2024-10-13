# TravelWise

- [TravelWise](#travelwise)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Installation and Configuration](#installation-and-configuration)
  - [Running the Application](#running-the-application)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MySQL Server and Client Utility like MySQL CLI/MySQLWorkbench

## Installation and Configuration

1. Clone the repository

   ```sh
   git clone https://github.com/yuqiao1205/travelwise.git
   cd travelwise
   ```

1. Importing the Database

   1. Ensure MySQL Server is running on your local machine and client utilities are installed.
   1. Import the database schema and initial content by using the database script file `scripts/db/dump20241012.sql`.
      1. You can use utility like MySQL CLI or MySQLWorkbench to run the database import script. It will create the travelwise schema if not present.

1. Install dependencies for backend and frontend.

   ```sh
   # Go to application/api folder
   npm install

   # Go to application/client folder
   npm install
   ```

1. Create and configure the backend .env file at `application/api/.env`, please use the below configuration template, configuration items are required for the respective features.

   ```.env
   # Local
   DATABASE_HOST=<db_hostname>
   DATABASE_USER=<db_user>
   DATABASE_PASS=<db_password>
   DATABASE_SCHEMA=travelwise

   # All API keys
   SENDGRID_API_KEY=  # SendGrid API Key for Sending the Notification Mail
   OPENAI_API_KEY=    # OpenAI API Key for ChatBot and Vision Feature
   COUNTRY_API_KEY=   # Country API Key for Weather Feature
   WEATHER_API_KEY=   # Weather API Key to Get the Weather Info
   X_RAPID_API_KEY=   # X Rapid API Key for Weather Feature
   YELP_API_KEY=      # Yelp API Key for Yelp search Feature

   # Secret key for the authentication password encryption
   Secret_Key=c1b586dc616452c1ced1f6bb65af186c
   ```

## Running the Application

1. Start the backend

   ```sh
   cd application/api
   npm start
   ```

   - The backend server will typically run on `http://localhost:8080`

2. Start the frontend

   ```sh
   cd application/client
   npm start
   ```

   - The frontend server will typically run on `http://localhost:3000`
