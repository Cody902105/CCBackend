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
const brewRoute = require('./routes/brew.js');
const rollRoute = require('./routes/roll.js');
const usersRoute = require('./routes/users.js');

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/info', infoRoute);
app.use('/card', cardRoute);
app.use('/update', timeout(36000000));
app.use('/update', updateRoute);
app.use('/brew', brewRoute);
app.use('/roll', rollRoute);
app.use('/users', usersRoute);

//Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, () => {
    console.log('Connected to database');
});

//Routes

//Listen
app.listen(8080);