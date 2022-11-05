const Sequelize = require('sequelize');

// get models
const UserModel = require('../models/users');
const db = new Sequelize(process.env.database, process.env.userDB, process.env.passwordDB, {
    host: process.env.hostDB,
    dialect: process.env.typeDB
})

const User = UserModel(db, Sequelize);
db.sync({ force: false }).then(() => {
    console.log("Sincronizado.")
})

module.exports = {
    User
}