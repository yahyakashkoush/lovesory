import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Single persistent connection for writes only
let writeClient = null;

async function getWriteConnection() {
  if (writeClient) {
    try {
      await writeClient.db('test').admin().ping();
      return writeClient;
    } catch (error) {
      console.error('[MongoDB] Write connection failed, reconnecting');
      writeClient = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
  });

  await client.connect();
  await client.db('test').admin().ping();
  
  writeClient = client;
  console.log('[MongoDB] Write connection established');
  return client;
}

export async function getContent() {
  let client = null;
  try {
    // Fresh connection for EVERY read - no caching
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });
    
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    const content = await collection.findOne({});
    
    if (content) {
      console.log('[getContent] ✅ Found:', content.femaleFirstName);
    } else {
      console.log('[getContent] ⚠️ No content found');
    }
    
    return content;
  } catch (error) {
    console.error('[getContent] ❌ Error:', error.message);
    throw error;
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

export async function updateContent(data) {
  try {
    const client = await getWriteConnection();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    console.log('[updateContent] 📝 Updating:', data.femaleFirstName);
    
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
    
    console.log('[updateContent] ✅ Updated');
    return result;
  } catch (error) {
    console.error('[updateContent] ❌ Error:', error.message);
    throw error;
  }
}

export function closeConnections() {
  if (writeClient) {
    writeClient.close();
    writeClient = null;
  }
}
