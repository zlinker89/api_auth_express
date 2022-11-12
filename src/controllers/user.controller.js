const { User } = require('../database/models');
const { v4: uuidv4 } = require('uuid');
const { make } = require('../helpers/password.helper');

const UserController = {};
UserController.getPaginated = async function (page, size, estados, filter = null) {
    const users = await User.getPaginated(page, size, estados, filter);
    // config pagination
    const { count, rows } = users;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(count / size);
    return { totalItems: count, rows, totalPages, currentPage };
}

UserController.searchUser = async function (predicate) {
    try {
        const user = await User.searchUser(predicate)
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

UserController.storeUser = async function (name, password) {
    try {
        // password hash 
        const passwordHash = await make(password);
        // validate if user exists
        const userDB = await User.searchUser({ name: name });
        if (userDB) {
            throw new Error("El usuario ya se encuentra registrado")
        }
        const user = await User.storeUser({
            name: name,
            password: passwordHash,
            hashId: uuidv4()
        });
        // hidden fields
        const userToShow = Object.assign(
            {},
            ...['id', 'hashId', 'name', 'estado', 'createdAt', 'updatedAt'].map(key => ({
                [key]: user[key]
            }))
        );
        return userToShow;
    } catch (error) {
        throw new Error(error);
    }
}

UserController.updateUser = async function (estado, hashId) {
    // update user
    try {
        const dataToUpdate = { estado };
        return await User.updateUser({ hashId: hashId }, dataToUpdate);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = UserController;