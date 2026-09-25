const db = require('../db/queries');

exports.getAllMessages = async function getAllMessages(req, res, next) {
    const messages = await db.getAllMessages();
    res.render('home', { messages });
};