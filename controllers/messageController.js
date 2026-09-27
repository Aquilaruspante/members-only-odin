const session = require('express-session');
const db = require('../db/queries');

exports.getAllMessages = async function getAllMessages(req, res, next) {
    const messages = await db.getAllMessages();

    const flash = req.session.flash;
    delete req.session.flash;
    
    res.render('home', { messages, flash });
};