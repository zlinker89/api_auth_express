
const User = require('../models/users');
const router = require('express').Router();
const { faker }= require("@faker-js/faker");


router.post('/faker/users',
    async (req, res) => {
        // create user fakers
        try {
            // generate faker
            const usersToInsert = [];
            for (let i = 0; i < 1000; i++) {
                usersToInsert.push({
                    name: faker.internet.email(),
                    password: faker.internet.password(),
                    hashId: faker.datatype.uuid()
                });
            }
            await User.bulkCreate(usersToInsert);
            res.json(usersToInsert);
        } catch (error) {
            return res.status(422).json({
                errors: {
                    msg: error.message
                }
            })
        }
    });

module.exports = router;