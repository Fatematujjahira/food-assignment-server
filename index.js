const express = require('express');
require("dotenv").config()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
// middleware

///newuser1
////keiJenIKbD8FBLQv
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fez92.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("mynewuser2");
      const productCollection = database.collection("products");
      const serviceCollection = database.collection("services");
      // POST API insert
     app.post('/addSinglePackage', async(req, res)=>{
         const product = req.body;
         const result = await productCollection.insertOne(product)
         res.send(result)
     })
     //GET ALL API
     app.get('/allProducts', async(req, res)=>{
         const cursor = productCollection.find({});
         const result = await cursor.toArray();
         res.send(result)
         console.log(result)
     });
     //DELETE API 
     app.delete('/deleteOrder/:id', async(req, res)=>{
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await serviceCollection.deleteOne(query);
         res.send(result)
         
     })

     // UPDATE get single product
     app.get('/singleProduct/:id', async(req, res)=>{
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await productCollection.findOne(query);
         res.send(result)
     })

     //UPDATE SINGLE Product
     app.put('/updateOrder/:id', async(req, res)=>{
         const id = req.params.id;
         const filter = {_id: ObjectId(id)};
         const options = {upsert: true};
         const updateDoc =  {
             $set: {
                status: "Approved"
             }
         }
         const result = await serviceCollection.updateOne(filter,updateDoc, options)
         res.json(result);
         console.log(result);

     })
     // POST API insert
     app.post('/addService', async(req, res)=>{
        const product = req.body;
        console.log('this is product', product);
        const result = await serviceCollection.insertOne(product)
        res.json(result);})
        // MY Orders
        app.get('/myOrders', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        // Mange all Orders
        app.get('/manageAllOrders', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
      console.log('database connect')
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('running my crud')
})
app.listen(port, ()=>{
    console.log('port server', port)
})