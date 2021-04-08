const express = require('express')

const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()

const port = process.env.PORT || 5055


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqysd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err)
  const collection = client.db("ekhaneisobkichodb").collection("products");
  const orderCollection = client.db("ekhaneisobkichodb").collection("order");
  app.get('/products', (req,res)=>{
    collection.find()
    .toArray((err, products)=>{
      res.send(products)
    })
  })


  app.post('/addProduct', (req,res)=>{

    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    collection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })
  
  app.post('/orderProduct', (req,res)=>{

    const products = req.body;
    console.log('adding order: ', products)
    orderCollection.insertOne(products)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/order', (req,res)=>{
    // console.log(req.query.email)
    orderCollection.find({email:req.query.email})
    .toArray((err, products)=>{
      res.send(products)
    })
  })
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})