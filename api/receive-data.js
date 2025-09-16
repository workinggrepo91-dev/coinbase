import { MongoClient } from "mongodb";

// Cache Mongo connection for re-use
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return { client: cachedClient, db: cachedDb };

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  const db = client.db("gpstracker");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const credentialsCollection = db.collection("credentials");

    const result = await credentialsCollection.insertOne(req.body);

    return res.status(200).json({
      success: true,
      message: "Data received and stored successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("MongoDB insert error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store data.",
    });
  }
}
