const { User, PersonalAccessTokens, Rol } = require('../database/models');
const { compare } = require('../helpers/password.helper');
const { hide } = require('../helpers/hideFields.helper');
const jwt = require('jsonwebtoken');
const { DateTime } = require("luxon");

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
            id: user.id
        }, process.env.TOKEN_SECRET);
        // eliminamos todos los tokens sin usar
        await PersonalAccessTokens.destroy({
            where: { userId: user.id }
        })
        // register token
        await PersonalAccessTokens.create({
            userId: user.id,
            token: token,
            lastUsed: DateTime.now().setZone("America/Bogota").toJSDate(),
        })
        return {
            data: { token }
        }
    } catch (error) {
        throw new Error(error);
    }
}

AuthController.getUserData = async function (token) {
    try {
        // validate token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = verified.id;
        // search user
        const user = await User.searchUser({ id: userId }, Rol);
        // update token
        const updated = await PersonalAccessTokens.update({
            lastUsed: DateTime.now().setZone("America/Bogota").toJSDate(),
        }, {
            where: { userId: user.id }
        })
        if (updated == 0) throw new Error("Acceso denegado")
        return hide(['id', 'hashId', 'name', 'Rols'], user);;
    } catch (error) {
        throw new Error(error);
    }
}

AuthController.logout = async function (token) {
    try {
        // validate token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = verified.id;
        // search user
        const user = await User.searchUser({ id: userId }, Rol);
        // eliminamos todos los tokens sin usar
        return await PersonalAccessTokens.destroy({
            where: { userId: user.id }
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = AuthController;