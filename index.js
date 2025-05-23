const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.get("/",(req,res)=>{
  res.send("task is hotter")
})


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.cc1e1ph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    await client.connect();
    const tasksCollection = client.db("tasksDb").collection("tasks")
  

    app.post("/tasks", async(req,res)=>{
      const newTasks = req.body
      const result = await tasksCollection.insertOne(newTasks)
      res.send(result)
    })
    app.get("/featured-tasks", async(req,res)=>{
      const result = await tasksCollection.find().limit(6).sort({ deadline: 1 }).toArray()
      res.send(result)
    })
    app.get('/tasks', async (req, res) => {
  const result = await tasksCollection.find().toArray();
  res.send(result);
});
 
app.get("/tasks/:id",async(req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await tasksCollection.findOne(query)
  res.send(result)
})
app.get("/tasks/user/:email", async(req,res)=>{
  const userEmail = req.params.email
  const result = await tasksCollection.find({userEmail}).toArray()
  res.send(result)
})
app.delete("/tasks/:id", async (req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await tasksCollection.deleteOne(query)
  res.send(result)
})
app.put("/tasks/:id",async(req,res)=>{
  const id = req.params.id
  const filter = {_id : new ObjectId(id)}
  const updateUser = req.body
  const updateDoc = {
    $set:updateUser
  }
  const result = await tasksCollection.updateOne(filter,updateDoc)
  res.send(result)
})
app.patch("/tasks/bid/:id", async(req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const bidUpdate = {
    $inc:{bids:1}
  }
  const result = await tasksCollection.updateOne(query ,bidUpdate)
  res.send(result)
})
app.get("/tasks", async (req, res) => {
  const email = req.query.email;  
  const result = await tasksCollection.find({ userEmail: email }).toArray();
  res.send(result);
});
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log("task is server")
})
// 9NKytzzhQGqeivCE