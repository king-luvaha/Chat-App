const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index')

const PORT = process.env.PORT || 8080


// Set up CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookiesParser());

// Define a route for the root URL
app.get('/',(request, response)=>{
    response.json({
        message : "Server running at PORT " + PORT
    })
})

// Define API endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("Server running at PORT " + PORT)
    })
})
