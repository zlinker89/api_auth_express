const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
// middleware
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// permite que otras apps accedan a mi API
app.use(cors()); 

// Set database and models
const db = require('./database/models')
const UserRouter = require('./routes/users.routes');
const AuthRouter = require('./routes/auth.routes');

// routes
app.use('/api/', UserRouter);
app.use('/api/', AuthRouter);
if (process.env.debug) {
    const FakerRouter = require('./routes/faker.routes');
    app.use('/api/', FakerRouter);
}
(async () => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync({ force: false })
        console.log("Database connected");
        // listen
        app.listen(3000, () => {
            console.log('Auth Server Started');
        });
    } catch (error) {
        throw new Error(error);
    }
})()


