const bcrypt = require("bcrypt")

async function make(plaintextPassword) {
    try {
        return bcrypt.hash(plaintextPassword, 10);
    } catch (error) {
        throw new Error(error);
    }
}

async function compare(plaintextPassword) {
    try {
        const hash = bcrypt.hash(plaintextPassword, 10);
        return bcyrpt.compare(plaintextPassword, hash);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    make,
    compare
}