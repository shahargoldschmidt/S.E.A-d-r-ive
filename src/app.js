// app.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Import Routers (Commented out until we actually create the files)
// const userRoutes = require('./routes/userRoutes');
// const tokensRoutes = require('./routes/tokensRoutes');
// const fileRoutes = require('./routes/fileRoutes');
// const searchRoutes = require('./routes/searchRoutes');
//const validator = require('./security/validator');

// Define Routes 
// Connecting the specific paths to their routers
// app.use('/api/users', userRoutes);
// app.use('/api/tokens', tokensRoutes);
// app.use('/api/files', fileRoutes);
// app.use('/api/search', searchRoutes);


//Start the server
app.listen(port)