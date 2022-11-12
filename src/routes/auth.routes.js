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
            error: error.message
        })
    }
});

router.get('/auth/get_user_data', async (req, res) => {
    try {
        const token = req.header('auth-token')
        if (!token) throw new Error('Acceso denegado');
        const result = await AuthController.getUserData(token);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({
            error: error.message
        }) 
    }
});

router.get('/auth/logout', async (req, res) => {
    try {
        const token = req.header('auth-token')
        if (!token) throw new Error('Acceso denegado');
        const result = await AuthController.logout(token);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({
            error: error.message
        }) 
    }
});

module.exports = router;