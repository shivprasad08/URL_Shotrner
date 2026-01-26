const mongoose = require('mongoose');

async function testDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/URL_Shortner', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Clear url_mappings
    console.log('🗑️ Clearing url_mappings...');
    const result = await db.collection('url_mappings').deleteMany({});
    console.log('✅ Deleted:', result.deletedCount);
    
    // Verify
    const count = await db.collection('url_mappings').countDocuments();
    console.log('📊 url_mappings document count after clear:', count);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDB();
