import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Single persistent connection for writes
let writeClient = null;
let writeDb = null;

async function getWriteConnection() {
  if (writeClient && writeDb) {
    try {
      await writeDb.admin().ping();
      return { client: writeClient, db: writeDb };
    } catch (error) {
      console.error('[MongoDB] Write connection failed, reconnecting');
      writeClient = null;
      writeDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 5,
    minPoolSize: 1,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
  });

  await client.connect();
  const db = client.db('test');
  await db.admin().ping();
  
  writeClient = client;
  writeDb = db;
  
  console.log('[MongoDB] Write connection established');
  return { client, db };
}

export async function getContent() {
  let client = null;
  try {
    // ALWAYS create a fresh connection for reads
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
    
    // Read from primary with majority concern
    const content = await collection.findOne(
      {},
      { 
        readPreference: 'primary',
        readConcern: { level: 'majority' }
      }
    );
    
    if (content) {
      console.log('[getContent] ✅ Retrieved:', {
        id: content._id,
        femaleFirstName: content.femaleFirstName,
        updatedAt: content.updatedAt
      });
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
    const { db } = await getWriteConnection();
    const collection = db.collection('contents');
    
    console.log('[updateContent] 📝 Updating:', {
      femaleFirstName: data.femaleFirstName,
      maleFirstName: data.maleFirstName,
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
    
    console.log('[updateContent] ✅ Updated:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
    
    // Wait for write to propagate
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
    writeDb = null;
  }
}
