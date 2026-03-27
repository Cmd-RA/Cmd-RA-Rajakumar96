import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function POST(request: Request) {
  if (!uri) {
    return NextResponse.json({ error: 'MONGODB_URI is not defined in Environment Variables.' }, { status: 500 });
  }

  try {
    const data = await request.json();
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('monetization_app');
    const collection = db.collection('posts_backup');
    
    // Insert post metadata into MongoDB as backup
    await collection.insertOne({
      ...data,
      syncedAt: new Date().toISOString()
    });
    
    await client.close();
    return NextResponse.json({ success: true, message: "Backup successful to MongoDB." });
  } catch (error: any) {
    console.error('MongoDB Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
