const UserController = require('../controllers/user.controller');
const router = require('express').Router();
const Joi = require('@hapi/joi');
const { hide } = require('../helpers/hideFields.helper');

const schemaStore = Joi.object({
    name: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(4).max(15).required()
})
const schemaUpdate = Joi.object({
    estado: Joi.string().required()
})
router.get('/users', async (req, res) => {
    const size = Number(req.query.size);
    const page = Number(req.query.page);
    const filter = req.query.filter;
    const estado = req.query.estado;
    try {
        const estados = {
            Todos: ['Activo', 'Inactivo'],
            Activo: ['Activo'],
            Inactivo: ['Inactivo']
        }
        const data = await UserController.getPaginated(page, size, estados[estado], filter);
        data.rows = data.rows.map(user => {
            return hide(['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'], user);
        });
        res.json(data);
    } catch (error) {
        return res.status(422).json({
            errors: {
                msg: error.message
            }
        })
    }
});

router.get('/users/:hashId', async (req, res) => {
    const { hashId } = req.params;
    const user = await UserController.searchUser({ hashId: hashId })
    if (user === null) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
    }
    // hidden fields
    const userToShow = hide(['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'], user);
    res.json(userToShow);
});

router.post('/users',
    async (req, res) => {
        // validate user
        const { error } = schemaStore.validate(req.body)
        if (error) {
            throw new Error(error.details[0].message);
        }
        const { name, password } = req.body;
        // create user
        try {
            const user = await UserController.storeUser(name, password);
            res.status(201).json(user);
        } catch (error) {
            return res.status(422).json({
                error: error.message
            })
        }
    });

router.put('/users/:hashId',
    async (req, res) => {
        // validate user
        const { error } = schemaUpdate.validate(req.body)
        if (error) {
            throw new Error(error.details[0].message);
        }
        // get parameters
        const { hashId } = req.params;
        const { estado } = req.body;
        // update user
        try {
            const updated = await UserController.updateUser(estado, hashId);
            res.status(200).json(updated);
        } catch (error) {
            return res.status(422).json({
                error: error
            })
        }
    });

module.exports = router;