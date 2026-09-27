const crypto = require('node:crypto');
const db = require('../db/queries');
const { genPassword } = require('../lib/passwordUtils');

exports.userCreate = async function userCreate(req, res, next) {
    try {
        const { firstname, lastname, username, password } = req.body;
        const { salt, genHash } = genPassword(password);

        await db.userCreate(firstname, lastname, username, genHash, salt);
        req.session.flash = { type: 'success', message: 'User created succesfully!'};
    } catch (err) {
        req.session.flash = { type: 'error', message: 'Oops! Something went wrong!'};
    };
    req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/messages');
    });
    
};