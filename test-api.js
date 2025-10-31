const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yahyaemad999_db_user:jYVOXbdTiww6Ngos@cluster0.lmh2xxt.mongodb.net/?appName=Cluster0';

async function testAPI() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('test');
    const collection = db.collection('contents');
    
    // Test 1: Read current data
    console.log('📖 TEST 1: Reading current data...');
    const currentData = await collection.findOne({});
    console.log('Current Female Name:', currentData.femaleFirstName);
    console.log('Current Male Name:', currentData.maleFirstName);
    
    // Test 2: Update data
    console.log('\n✏️  TEST 2: Updating data...');
    const updateResult = await collection.updateOne(
      {},
      { 
        $set: { 
          femaleFirstName: 'Test Update ' + Date.now(),
          updatedAt: new Date()
        } 
      },
      { 
        upsert: true,
        writeConcern: { w: 'majority', j: true }
      }
    );
    console.log('Update result:', {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount
    });
    
    // Test 3: Wait and read fresh data
    console.log('\n⏳ TEST 3: Waiting 200ms for propagation...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('📖 Reading fresh data after update...');
    const freshData = await collection.findOne({});
    console.log('Fresh Female Name:', freshData.femaleFirstName);
    console.log('Fresh Male Name:', freshData.maleFirstName);
    
    // Test 4: Verify update worked
    console.log('\n✅ TEST 4: Verification');
    if (freshData.femaleFirstName.includes('Test Update')) {
      console.log('✅ UPDATE SUCCESSFUL - Data was updated and read correctly');
    } else {
      console.log('❌ UPDATE FAILED - Data was not updated');
    }
    
    // Test 5: Revert changes
    console.log('\n🔄 TEST 5: Reverting changes...');
    await collection.updateOne(
      {},
      { 
        $set: { 
          femaleFirstName: 'Maii',
          updatedAt: new Date()
        } 
      }
    );
    console.log('✅ Changes reverted');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

testAPI();
