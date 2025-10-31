import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await client.connect();
  const db = client.db('test');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getContentCollection() {
  const { db } = await connectToDatabase();
  return db.collection('contents');
}

export async function getContent() {
  const collection = await getContentCollection();
  return await collection.findOne({});
}

export async function updateContent(data) {
  const collection = await getContentCollection();
  const result = await collection.updateOne(
    {},
    { $set: data },
    { upsert: true }
  );
  return result;
}
