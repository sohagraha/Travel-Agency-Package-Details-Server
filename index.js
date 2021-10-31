const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fj33t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log("Hitting");
//     client.close();
// })

async function run() {
    try {
        await client.connect();
        //console.log("database connected");
        const database = client.db("Traveliya");
        const servicesCollection = database.collection("services")
        const ordersCollection = database.collection("orders")

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
            // console.log("hitting post");
            res.send('inside post');
        })
        app.post('/orders', async (req, res) => {
            const service = req.body;
            const result = await ordersCollection.insertOne(service);
            res.json(result)
            console.log("hitting post");
            res.send('inside post');
        })


        // DELETE my order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log('Delate id', result);
            res.json(result);

        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await ordersCollection.findOne(query);
            res.json(service);
        })

        //Update Api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.json(result)
        }
        )


    }
    finally {

        //await client.close();
    }
}
run().catch(console.dir);


// default
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})