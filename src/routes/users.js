const User = require('../models/users');
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { make } = require('../helpers/passwordHelper');

router.get('/users', async (req, res) => {
    const users = await User.findAll();
    const usersMap = users.map(user => {
        return Object.assign(
            {},
            ...['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'].map(key => ({
                [key]: user[key]
            }))
        );
    });
    res.json(usersMap);
});

router.get('/users/:hashId', async (req, res) => {
    const { hashId } = req.params;
    const user = await User.searchUser({ hashId: hashId })
    if (user === null) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
    // hidden fields
    const userToShow = Object.assign(
        {},
        ...['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'].map(key => ({
            [key]: user[key]
        }))
    );
    res.json(userToShow);
});

router.post('/users',
    // name must be an email
    body('name').isEmail()
        .withMessage('Debe ingresar un Email valido'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 4 })
        .withMessage('Debe ingresar minimo 4 caracteres'),
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in 
        // an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, password } = req.body;
        // create user
        const hashPassword = await make(password);
        try {
            // validate if user exists
            const userDB = await User.searchUser({ name: name });
            if (userDB) {
                throw new Error("El usuario ya se encuentra registrado")
            }
            const user = await User.storeUser({
                name: name,
                password: hashPassword,
                hashId: uuidv4()
            });
            // hidden fields
            const userToShow = Object.assign(
                {},
                ...['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'].map(key => ({
                    [key]: user[key]
                }))
            );
            res.json(userToShow);
        } catch (error) {
            return res.status(422).json({
                errors: {
                    msg: error.message
                }
            })
        }
    });

module.exports = router;