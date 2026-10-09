const db = require('../db/queries');
const ExpressError = require('../expressError');

exports.adminGet = async function adminGet(req, res, next) {
    try {
        const users = await db.getAllUsers();

        res.render('admin', { users });
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};

exports.adminPost = async function adminPost(req, res, next) {
    const { admin, userId } = req.body;
    
    try {
        if (admin) {
            await db.updateUser(userId, true);
        } else {
            await db.updateUser(userId, false);
        };

        res.redirect('/admin');
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};