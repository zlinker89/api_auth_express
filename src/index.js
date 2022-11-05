const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
// middleware
app.use(express.json());
app.use(cors()); // permite que otras apps accedan a mi API

// Set database and models
const db = require('./configuration/db')
const UserRouter = require('./routes/users');

(async () => {
    try {
        await db.authenticate();
        await db.sync({ force: false })
        console.log("Database connected");
    } catch (error) {
        throw new Error(error);
    }
})()


// routes
app.use(UserRouter);

// listen
app.listen(3000, () => {
    console.log('Auth Server Started');
});