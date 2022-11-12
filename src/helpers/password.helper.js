const bcrypt = require("bcrypt")

async function make(plaintextPassword) {
    try {
        return bcrypt.hash(plaintextPassword, 10);
    } catch (error) {
        throw new Error(error);
    }
}

async function compare(plaintextPassword, hash) {
    try {
        return bcrypt.compare(plaintextPassword, hash);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    make,
    compare
}