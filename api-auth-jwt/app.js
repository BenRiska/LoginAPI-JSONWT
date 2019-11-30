const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to MongoDB')
)
// middleware
app.use(express.json());

// route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// listen for server
app.listen(3000, () => console.log('Up and running..'));