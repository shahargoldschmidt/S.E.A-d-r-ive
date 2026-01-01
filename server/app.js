// app.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Import Routers
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const fileRoutes = require('./routes/fileRoutes');
const searchRoutes = require('./routes/searchRoutes');


// Define Routes 
// Connecting the specific paths to their routers
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);


//Start the server
app.listen(port)