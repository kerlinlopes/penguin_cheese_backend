/////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give it a default of 3000 (object destructuring)
const { PORT = 3001, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create the application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
//import middleware
const morgan = require("morgan");
const cors = require("cors");

/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to Mongo"))
  .on("close", () => console.log("You are disconnected from Mongo"))
  .on("error", (error) => console.log(error));

//////////////////////////////
// Models
//////////////////////////////
// the cheese schema
const CheeseSchema = new mongoose.Schema(
  {
    name: String,
    countryOfOrigin: String,
    image: String,
  },
  { timestamps: true }
);

const Cheese = mongoose.model("Cheese", CheeseSchema);

/////////////////////////////////
//Middleware
/////////////////////////////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


/////////////////////////////////
//Routes
/////////////////////////////////
app.get("/", (req, res)=> {
    res.send("THIS IS THE CHEESE INFO!!")
})

// Cheese index route
// get request to /cheese, returns all cheese as json
app.get("/cheese", async (req, res) => {
  try {
    // send all cheese
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Cheese create route
// post request to /cheese, uses request body to make new cheese
app.post("/cheese", async (req, res) => {
  try {
    // screate a new person
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Cheese update  route
// put request /cheese/:id, updates person based on id with request body
app.put("/cheese/:id", async (req, res) => {
    try {
        // update a person
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// Destroy Route 
// delete request to /cheese/:id, deletes the person specified
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete a person
        res.json(await Cheese.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})


/////////////////////////////////
//Listener
/////////////////////////////////

app.listen(PORT, (req, res)=>{
    console.log(`Listening on port ${PORT}`)
})