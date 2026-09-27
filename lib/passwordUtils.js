const crypto = require('node:crypto');

exports.genPassword = function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');

    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return { salt, genHash };
};

exports.verifyPassword = function verifyPassword(password, salt, hashedpassword) {
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    if (hashedpassword === genHash) {
        return true;
    } else {
        return false;
    };
};