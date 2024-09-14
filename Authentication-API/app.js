const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");  // Import the cors middleware
require('dotenv').config();
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

//! Routes
app.use("/", router);

//! Error handler
app.use(errorHandler);

//! Start the server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
