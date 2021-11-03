const express = require('express');
const app = express();
var timeout = require('connect-timeout');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Import Routes
const infoRoute = require('./routes/info');
const cardRoute = require('./routes/card');
const updateRoute = require('./routes/update');

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/info', infoRoute);
app.use('/card', cardRoute);
app.use('/update',timeout(36000000));
app.use('/update',updateRoute);

//Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, () => {
    console.log('Connected to database');
});

//Routes

//Listen
app.listen(8080);