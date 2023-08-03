////////////////////////
// Setup - Import deps and create app object
////////////////////////
// read the .env file and create the variables
require("dotenv").config();
// pull PORT from .env and give it a default value as well, also pull the DATABASE_URL
const {PORT = 7500, DATABASE_URL} = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors");
// import morgan
const morgan = require("morgan");
const exp = require("constants");

//////////////////////
// Database Connection
//////////////////////
// Establish a connection
mongoose.connect(DATABASE_URL);

// Add Connection events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))

//////////////////////
// Models
//////////////////////
// models = PascalCase, singular "People"
// collections, tables = snake_case, plural "peoples"
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheeses = mongoose.model("Cheeses", cheeseSchema)

//////////////////////
// Declare Middleware
//////////////////////
// cors for preventing cors errors (this allows all requests from other origins)
app.use(cors());
// morgan for logging requests
app.use(morgan("dev"));
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

///////////////////////
// Declare Routes and Routers
///////////////////////
// INDUCES - Index, New, Delete, Update, Create, Edit, Show

// Index - Get - /cheeses - gets all cheeses in the database
app.get("/cheeses", async (req, res) => {
    try {
        // fetch all the cheeses
        const cheeses = await Cheeses.find({})
        // send JSON of all cheeses
        res.json(cheeses)
    } catch (error) {
        // send error as JSON
        res.status(400).json({error})
    }
})

// Create - Post - /cheeses - create a new cheese
app.post("/cheeses", async (req, res) => {
    try {
        // create the new cheese
        const cheese = await Cheeses.create(req.body)
        // send newly created cheese as JSON
        res.json(cheese)
    } catch (error) {
        res.status(400).json({error})
    }
})

// Show - Get - /cheeses/:id - get a single cheese and display it
app.get("/cheeses/:id", async (req, res) => {
    try {
        // get a cheese from the database
        const cheese = await Cheeses.findById(req.params.id)
        // return the cheese as JSON
        res.json(cheese)
    } catch (error) {
        res.status(400).json({error})
    }
})

// Update - Put - /cheeses/:id - update a single cheese in the database
app.put("/cheeses/:id", async (req, res) => {
    try {
        // update the cheese
        const cheese = await Cheeses.findByIdAndUpdate(req.params.id, req.body, {new: true})
        // send the updated cheese as JSON
        res.json(cheese)
    } catch (error) {
        res.status(400).json({error})
    }
})

// Destroy - Delete - /cheeses/:id - delete a single cheese from the database
app.delete("/cheeses/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheese = await Cheeses.findByIdAndDelete(req.params.id)
        // send the deleted cheese as JSON
        res.status(204).json(cheese)
    } catch (error) {
        res.status(400).json({error})
    }
})

// quick test route
app.get("/", (req, res) => {
    res.json({hello: "world"})
});

///////////////////////////
// Server Listener
///////////////////////////
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))