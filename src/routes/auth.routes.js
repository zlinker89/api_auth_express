const AuthController = require('../controllers/auth.controller');
const router = require('express').Router();
const Joi = require('@hapi/joi');

const schemaLogin = Joi.object({
    name: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().min(4).max(70).required()
})
router.post('/auth/login', async (req, res) => {
    try {
        // validate login form
        const { error } = schemaLogin.validate(req.body);
        if (error) throw new Error(error.details[0].message)
        const result = await AuthController.login(req.body.name, req.body.password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(422).json({
            errors: {
                msg: error.message
            }
        })
    }
});


module.exports = router;