const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
require('dotenv').config();

const { scheduleDailyReset, resetDailyCheckIns } = require('./cron/resetCheckIns.js');  // Import the cron job

const app = express();

//! Connect to mongodb
const dbUsername = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DATABASE;
const dbCluster = process.env.MONGODB_CLUSTER;

const mongoUri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri)
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

//! Middlewares
app.use(express.json()); // Parse incoming JSON data

// Configure CORS globally
const corsOptions = {
  origin: "*",  // Allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true  // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));  // Use CORS middleware

//! Schedule the daily cron job
scheduleDailyReset();

// Route to manually trigger the task for testing
app.post('/test-reset', async (req, res) => {
  try {
    await resetDailyCheckIns();
    res.send('Check-ins reset and streak updated!');
  } catch (error) {
    res.status(500).send('Error occurred during the manual test');
  }
});

//! Routes
app.use("/", router);

//! Error handler
app.use(errorHandler);

//! Start the server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));