const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.hkduy2w.mongodb.net/?retryWrites=true&w=majority`;
 
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      client.connect();

    const toyCollection = client.db('toyDB').collection('toy');

    // read (get all toys)
    app.get('/toy', async(req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    })
    // get a single toy
    app.get('/toy/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result);
    })

    
    // get data by user email
    app.get('/toys', async(req, res) => {
      console.log(req.query.email);
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    // get data by subcategory
    app.get('/category', async(req, res)=> {
      console.log(req.query.subcategory);
      let query = {};
      if(req.query?.subcategory){
        query = {subcategory: req.query.subcategory}
      }
       const result = await toyCollection.find(query).toArray();
       res.send(result);
        
    })

    
    // create
    app.post('/toy', async(req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy)
      res.send(result);
    })


    // delete
    app.delete('/toy/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query);
      res.send(result)
    })

    // update 
    app.put('/toy/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedToy = req.body;
        console.log(updatedToy );

      const update = {
        $set: {
            price:updatedToy.price,
            quantity:updatedToy.quantity,
            description:updatedToy.description
        },
      };

      const result = await toyCollection.updateOne(filter, update, options)
      res.send(result)
  

        

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();

  }
}
run().catch(console.dir);









app.get('/', (req, res)=> {
    res.send("TOY CARS SERVER IS RUNNING ON...")
})

app.listen(port, ()=> {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
})

