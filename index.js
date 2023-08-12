const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// mongoDb canaction/\

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqsmgls.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('cardproduct').collection('products')
        const userCollection = client.db('cardproduct').collection('userproduct')
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.get('/userproduct', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
        app.get('/userproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const product = req.body;
            const option = { upsert: true };
            const updatedproduct = {
                $set: {
                    name: product.name,
                    supliarName: product.supliarName,
                    img: product.img,
                    price: product.price,
                    email: product.email,
                    quantity: product.quantity,
                    message: product.message,
                }
            }
            const result = await productCollection.updateOne(query, updatedproduct, option)
            res.send(result)
        })
        app.put('/userproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedItems = {
                $set: {
                    name: user.name,
                    price: user.price,
                    quantity: user.quantity,
                    supliarName: user.supliarName,
                    message: user.message,
                }
            }
            const result = await userCollection.updateOne(query, updatedItems, option)
            res.send(result)
        })

        app.post('/userproduct', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })
        app.delete('/userproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
            console.log(result);
        })

    }
    finally { }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('running assaginment 11 sarver')
});
app.listen(port, () => {
    console.log(`installing server port assaginment-11, ${port}`);
})
