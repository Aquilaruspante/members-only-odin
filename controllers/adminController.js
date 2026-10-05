const db = require('../db/queries');

exports.adminGet = async function adminGet(req, res, next) {
    const users = await db.getAllUsers();

    res.render('admin', { users });
};

exports.adminPost = async function adminPost(req, res, next) {
    const { admin, userId } = req.body;
    
    if (admin) {
        await db.updateUser(userId, true);
    } else {
        await db.updateUser(userId, false);
    };

    res.redirect('/admin');
};