import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Return cached connection if available and connected
  if (cachedClient && cachedDb) {
    try {
      // Verify connection is still alive
      await cachedDb.admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.error('[MongoDB] Cached connection failed, reconnecting:', error.message);
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
  });

  try {
    await client.connect();
    const db = client.db('test');
    
    // Verify connection
    await db.admin().ping();
    
    cachedClient = client;
    cachedDb = db;
    
    console.log('[MongoDB] Connected successfully');
    return { client, db };
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error.message);
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
    // Use readPreference to ensure fresh read from primary
    const content = await collection.findOne(
      {},
      { 
        readPreference: 'primary',
        readConcern: { level: 'majority' }
      }
    );
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
      { 
        $set: { 
          ...data, 
          updatedAt: new Date() 
        } 
      },
      { 
        upsert: true,
        writeConcern: { w: 'majority', j: true }
      }
    );
    
    console.log('[updateContent] Update result:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    });
    
    // Force a fresh read after update to ensure data consistency
    // Wait a bit for write to propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return result;
  } catch (error) {
    console.error('[updateContent] Error:', error);
    throw error;
  }
}

export function clearConnectionCache() {
  console.log('[MongoDB] Clearing connection cache');
  cachedClient = null;
  cachedDb = null;
}
