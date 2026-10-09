const pool = require('../db/pool');
const db = require('../db/queries');
const ExpressError = require('../expressError');

exports.getAllMessages = async function getAllMessages(req, res, next) {
    try {
        const messages = await db.getAllMessages();
        for (const message of messages) {
            const user = await db.userGetById(message.user_id);
            message.user = user;
        };
        
        const sessionMessages = req.session.messages;

        delete req.session.messages;

        res.render('home', { messages, sessionMessages });
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};

exports.messageCreateGet = function messageCreateGet(req, res, next) {
    const sessionMessages = req.session.messages;
    delete req.session.messages;

    res.render('newMessage', { sessionMessages });
};

exports.messageCreatePost = async function messageCreatePost(req, res, next) {
    try {
        const { body } = req.body;
        const userId = req.user.id;

        await db.messageCreatePost(body, userId);

        req.session.messages = { type: 'success', message: 'Post created succesfully!' };
        req.session.save(err => {
            if (err) return next(err);

            if (req.session.route === '/new') {
                delete req.session.route;
                return res.redirect('/messages/new');
            }
            res.redirect('/messages');
        });
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
    }

};

exports.messageDelete = async function messageDelete(req, res, next) {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM messages WHERE id=$1', [id]);
        res.redirect('/messages');
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};