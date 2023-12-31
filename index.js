const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.uoombu0.mongodb.net/?retryWrites=true&w=majority`;

//middle ware

app.use(cors());
app.use(express.json());

//mongodb connection

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("toyverse");
    const toyCollection = database.collection("toys");

    //api request's

    //get apis
    app.get("/toys", async (req, res) => {
      const result = await toyCollection.find().toArray();

      res.send(result);
    });
    app.get("/toys/toy/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await toyCollection.find(query).toArray();

      res.send(result);
    });
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);

      res.send(result);
    });

    //post apis
    app.post("/toys", async(req,res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
    })
    //delete apis
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);

      res.send(result);
    });

    //patch apis
    app.patch("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: body.name,
          email: body.email,
          picture: body.picture,
          category: body.category,
          price: body.price,
          rating: body.rating,
          details: body.details,
        },
      };

      const result = await toyCollection.updateOne(filter, updateDoc);

      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("WELCOME TO TOYVERSE SERVER");
});

app.listen(port, () => {
  console.log("App running on port:", port);
});
