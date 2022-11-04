const express = require('express');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

require('./configuration/db')


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});


// listen
app.listen(3000, () => {
    console.log('Auth Server Started');
});