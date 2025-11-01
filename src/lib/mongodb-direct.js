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
  let client = null;
  try {
    // Create a FRESH connection for reads to bypass any caching
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: false, // Disable retry to get fresh read
    });
    
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    // Read with explicit primary preference and majority read concern
    const content = await collection.findOne(
      {},
      { 
        readPreference: 'primary',
        readConcern: { level: 'majority' }
      }
    );
    
    console.log('[getContent] Retrieved:', content ? {
      maleFirstName: content.maleFirstName,
      femaleFirstName: content.femaleFirstName,
      updatedAt: content.updatedAt
    } : 'Not found');
    
    return content;
  } catch (error) {
    console.error('[getContent] Error:', error);
    throw error;
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error('[getContent] Error closing client:', e);
      }
    }
  }
}

export async function updateContent(data) {
  try {
    const collection = await getContentCollection();
    
    console.log('[updateContent] Updating with:', Object.keys(data));
    console.log('[updateContent] Data values:', {
      maleFirstName: data.maleFirstName,
      femaleFirstName: data.femaleFirstName,
      tagline: data.tagline?.substring(0, 30),
      loveMessage: data.loveMessage?.substring(0, 30),
    });
    
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
    
    // Wait for write to propagate
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
