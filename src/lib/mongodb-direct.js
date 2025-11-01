import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// NO persistent connections - create fresh connection for EVERY operation
// This ensures we always read the latest data from MongoDB

export async function getContent() {
  let client = null;
  try {
    // Create a completely fresh connection for this read
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      // Force reading from primary to get latest data
      readPreference: 'primary',
    });
    
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    // Read with primary read preference to ensure latest data
    const content = await collection.findOne({}, { readPreference: 'primary' });
    
    if (content) {
      console.log('[getContent] ✅ Read from DB:', {
        maleFirstName: content.maleFirstName,
        femaleFirstName: content.femaleFirstName,
        updatedAt: content.updatedAt
      });
      
      // Convert ObjectId to string for JSON serialization
      return {
        ...content,
        _id: content._id?.toString(),
      };
    } else {
      console.log('[getContent] ⚠️ No content found in database');
    }
    
    return content;
  } catch (error) {
    console.error('[getContent] ❌ Error:', error.message);
    throw error;
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('[getContent] Connection closed');
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

export async function updateContent(data) {
  let client = null;
  try {
    // Create a fresh connection for this write
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority',
    });
    
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    console.log('[updateContent] 📝 Writing to DB:', {
      maleFirstName: data.maleFirstName,
      femaleFirstName: data.femaleFirstName,
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
    
    console.log('[updateContent] ✅ Write completed:', {
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
    
    return result;
  } catch (error) {
    console.error('[updateContent] ❌ Error:', error.message);
    throw error;
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('[updateContent] Connection closed');
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

export async function getContentCollection() {
  let client = null;
  try {
    // Create a fresh connection to get the collection
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      readPreference: 'primary',
    });
    
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('contents');
    
    // Return collection with client reference for cleanup
    return {
      ...collection,
      _client: client
    };
  } catch (error) {
    console.error('[getContentCollection] ❌ Error:', error.message);
    if (client) {
      try {
        await client.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    throw error;
  }
}

export function closeConnections() {
  // No persistent connections to close
  console.log('[closeConnections] No persistent connections to close');
}
