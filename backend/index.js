const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
app.use(express.json());

// MongoDB setup
const client = new MongoClient(
  process.env.MONGODB_URI || 'mongodb://localhost:27017',
);

// Helper function to coerce isComplete to boolean
function coerceItemData(data) {
  if (data && 'isComplete' in data) {
    data.isComplete = !!Number(data.isComplete);
  }
  return data;
}

async function start() {
  await client.connect();
  const db = client.db('PowerSync');
  const items = db.collection('Item');

  app.post('/update', async (req, res) => {
    const operations = req.body;

    try {
      for (const op of operations) {
        console.log(JSON.stringify(op, null, 2));
        switch (op.op) {
          case 'PUT':
            await items.insertOne({
              ...coerceItemData(op.data),
              _id: new ObjectId(op.id),
            });
            break;

          case 'PATCH':
            await items.updateOne(
              {_id: new ObjectId(op.id)},
              {$set: coerceItemData(op.data)},
            );
            break;

          case 'DELETE':
            await items.deleteOne({
              _id: new ObjectId(op.id),
            });
            break;
        }
      }
      res.json({success: true});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });

  app.listen(8000, () => {
    console.log('Server running on port 8000');
  });
}

start().catch(console.error);
