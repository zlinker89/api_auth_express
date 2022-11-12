const { User } = require('../database/models');
const { compare } = require('../helpers/password.helper');
const jwt = require('jsonwebtoken');

const AuthController = {};

AuthController.searchUser = async function (predicate) {
    try {
        const user = await User.searchUser(predicate)
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

AuthController.login = async function (name, password) {
    try {
        // search user
        const user = await User.searchUser({ name: name })
        // validate password
        const validPassword = await compare(password, user.password)
        if (!validPassword) throw new Error('contraseña no válida')
        // create JWT
        const token = jwt.sign({
            name: user.name,
            id: user._id
        }, process.env.TOKEN_SECRET)
        return {
            data: { token }
        }
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = AuthController;