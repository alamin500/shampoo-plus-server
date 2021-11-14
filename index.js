const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

// const uri =
//   "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vil1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
const uri =
  'mongodb+srv://alamin-matlab_2021:gVZPplwupeaQWwOJ@cluster0.2vil1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Welcome our Shampoo Plus Website!');
});
client.connect((err) => {
  const shampooCollection = client
    .db('shampooPlusWebsite')
    .collection('shampoo');

  const OrdersCollection = client.db('shampooPlusWebsite').collection('orders');

  const ReviewCollection = client.db('shampooPlusWebsite').collection('review');

  const usersCollection = client.db('shampooPlusWebsite').collection('users');
  // perform actions on the collection object

  // Add Product
  app.post('/addShampoo', async (req, res) => {
    const result = await shampooCollection.insertOne(req.body);
  });

  // Add Reviews
  app.post('/addReview', async (req, res) => {
    const result = await ReviewCollection.insertOne(req.body);
  });

  // Get Reviews
  app.get('/reviews', async (req, res) => {
    const result = await ReviewCollection.find({}).toArray();
    res.send(result);
  });

  // Add Orders
  app.post('/order', async (req, res) => {
    const result = await OrdersCollection.insertOne(req.body);
  });

  //put/update
  app.put('/users', async (req, res) => {
    const result = await usersCollection.updateOne(
      { email: req.body.email },
      { $set: req.body },
      { upsert: true }
    );
    res.send(result);
  });

  // Get Admin
  app.get('/admin/:email', async (req, res) => {
    const result = await usersCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

  // Get My orders
  app.get('/myOrder/:email', async (req, res) => {
    const result = await OrdersCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

  // Get All Books
  app.get('/allOrders', async (req, res) => {

    const result = await OrdersCollection.find({}).toArray();
    res.send(result);
  });

  // Add user
  app.post('/users', async (req, res) => {
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
  });

  // Make Admin

  app.put('/makeAdmin', async (req, res) => {
    const filter = { email: req.body.email };
    const result = await usersCollection.find(filter);
    if (result) {
      const updates = await usersCollection.updateOne(filter, {
        $set: { role: 'admin' },
      });
    }
  });

  // Delete MyBook
  app.delete('/deleteOrder/:id', async (req, res) => {
    const result = await OrdersCollection.deleteOne({
      _id: req.params.id,
    });
    res.send(result);
  });

  // Delete Product
  app.delete('/deleteProducts/:id', async (req, res) => {
    const result = await shampooCollection.deleteOne({
       _id: ObjectId(req.params.id) ,
    });
    res.send(result);
  });

//Update Status
  app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const result = await OrdersCollection.updateOne(filter, {
      $set: {
        status: req.body,
      },
    });
    res.send(result);
  });


  // Get Products
  app.get('/products', async (req, res) => {
    const result = await shampooCollection.find({}).toArray();
    res.send(result);
  });
  // client.close();
});
app.listen(process.env.PORT || port, () => {
  console.log(`listening at ${port}`);
});
