const { Op } = require('sequelize');
const User = require('../models/users');

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

UserController.storeUser = async function (user) {
    try {
        const userCreated = await User.storeUser(user)
        return userCreated;
    } catch (error) {
        throw new Error(error);
    }
}

UserController.updateUser = async function (predicate, data) {
    try {
        return await User.updateUser(predicate, data);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = UserController;