import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Always create a fresh connection to avoid caching issues
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority',
  });

  try {
    await client.connect();
    const db = client.db('test');
    
    // Test the connection
    await db.admin().ping();
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getContentCollection() {
  const { db } = await connectToDatabase();
  return db.collection('contents');
}

export async function getContent() {
  try {
    const collection = await getContentCollection();
    const content = await collection.findOne({});
    console.log('[getContent] Retrieved:', content ? 'Found' : 'Not found');
    return content;
  } catch (error) {
    console.error('[getContent] Error:', error);
    throw error;
  }
}

export async function updateContent(data) {
  try {
    const collection = await getContentCollection();
    
    console.log('[updateContent] Updating with:', Object.keys(data));
    
    const result = await collection.updateOne(
      {},
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    );
    
    console.log('[updateContent] Update result:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    });
    
    return result;
  } catch (error) {
    console.error('[updateContent] Error:', error);
    throw error;
  }
}
