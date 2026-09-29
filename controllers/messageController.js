const db = require('../db/queries');

exports.getAllMessages = async function getAllMessages(req, res, next) {
    const messages = await db.getAllMessages();

    const flash = req.session.flash;
    delete req.session.flash;

    const user = req.user;
    
    const sessionMessages = req.session.messages;
    console.log('messages', sessionMessages);
    delete req.session.messages;

    res.render('home', { messages, flash, user, sessionMessages });
};