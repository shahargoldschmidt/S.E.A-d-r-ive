// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import Routers
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const fileRoutes = require('./routes/fileRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Connection to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myDriveDB';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Could not connect to MongoDB", err);
});

// Define Routes 
// Connecting the specific paths to their routers
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);


//Start the server
app.listen(port)