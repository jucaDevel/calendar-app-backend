const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

dbConnection();

const app = express();

//CORS
app.use(cors())

//Public files
app.use(express.static('./public'));

//Read and parse body
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/event', require('./routes/event'));

module.exports = app