const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yahyaemad999_db_user:jYVOXbdTiww6Ngos@cluster0.lmh2xxt.mongodb.net/?appName=Cluster0';

async function debugDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('test');
    const collection = db.collection('contents');
    
    // Check how many documents exist
    const count = await collection.countDocuments({});
    console.log(`\n📊 Total documents in collection: ${count}`);
    
    // Get all documents
    const allDocs = await collection.find({}).toArray();
    console.log(`\n📄 All documents:`);
    allDocs.forEach((doc, index) => {
      console.log(`\n--- Document ${index + 1} ---`);
      console.log(`ID: ${doc._id}`);
      console.log(`Male Name: ${doc.maleFirstName}`);
      console.log(`Female Name: ${doc.femaleFirstName}`);
      console.log(`Tagline: ${doc.tagline?.substring(0, 50)}...`);
      console.log(`Love Message: ${doc.loveMessage?.substring(0, 50)}...`);
      console.log(`Images Count: ${doc.images?.length || 0}`);
      console.log(`Song: ${doc.song?.filename || 'None'}`);
      console.log(`Cover: ${doc.songCover?.filename || 'None'}`);
      console.log(`Created: ${doc.createdAt}`);
      console.log(`Updated: ${doc.updatedAt}`);
    });
    
    // If multiple documents, show which one is being used
    if (count > 1) {
      console.log(`\n⚠️  WARNING: Multiple documents found! This is the problem.`);
      console.log(`The system will use the first document (ID: ${allDocs[0]._id})`);
    } else if (count === 0) {
      console.log(`\n⚠️  WARNING: No documents found! Database is empty.`);
    } else {
      console.log(`\n✅ Database is clean - only one document exists`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

debugDatabase();
