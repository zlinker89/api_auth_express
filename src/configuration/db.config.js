const Sequelize = require('sequelize');

const db = new Sequelize(process.env.database, process.env.userDB, process.env.passwordDB, {
    host: process.env.hostDB,
    port: process.env.portDB,
    dialect: process.env.typeDB
})

module.exports = db