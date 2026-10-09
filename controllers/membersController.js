const db = require('../db/queries');

exports.memberGet = async function(req, res, next) {
    const sessionMessages = req.session.messages;
    delete req.session.messages;

    res.render('member', { sessionMessages });
};

exports.memberPost = async function(req, res, next) {
    const { riddle } = req.body;
    const user = req.user;
    
    if (riddle.toLowerCase() === 'blue') {
        await db.updateMemberStatus(user.id);
        req.session.messages = { type: 'success', message: 'Welcome into the Inner circle!' };
        req.session.save(err => {
            if (err) return next(err);
            res.redirect('/messages');
        });
    } else {
        req.session.messages = { type: 'failure', message: 'Try again!' };
        req.session.save(err => {
            if (err) return next(err);
            res.redirect('members');
        });
    };
};