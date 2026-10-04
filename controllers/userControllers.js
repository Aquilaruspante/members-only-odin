const crypto = require('node:crypto');
const db = require('../db/queries');
const { genPassword } = require('../lib/passwordUtils');
const passport = require('passport');

function authenticateAndRedirect(req, res, next, route) {
    if (!route) route = '/';
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            try {
                req.session.messages = { type: 'error', message: 'Wrong credentials!' };
                req.session.save(err => {
                    if (err) return next(err);
                    return res.redirect('/user/login');
                });
            } catch(err) {
                console.log('this is the error')
                next(err);
            }
            
        };
        req.login(user, err => {
            if (err) return next(err);
            req.session.messages = { type: 'success', message: `Welcome ${user.username}` };
            req.session.save(err => {
                if (err) return next(err);  
                res.redirect(`/messages${route}`);
            });
        });
    })(req, res, next);
};

exports.userCreateGet = function userCreateGet (req, res, next) {
    const sessionMessages = req.session.messages;
    delete req.session.messages;

    res.render('register', { sessionMessages });
};

exports.userCreate = async function userCreate(req, res, next) {
    try {
        const { firstname, lastname, username, password } = req.body;
        const { salt, genHash } = genPassword(password);

        await db.userCreate(firstname, lastname, username, genHash, salt);
        const user = await db.userGetByUsername(username);
        req.login(user, (err) => {
            if (err) return next(err);
            req.session.messages = { type: 'success', message: 'User created succesfully!'};
            return res.redirect('/messages');
        });
        
    } catch (err) {
        console.log(err);
        req.session.messages = { type: 'error', message: 'Oops! Something went wrong!'};
        req.session.save((err) => {
            if (err) return next(err);
            res.redirect('/user/register');
        });
    };  
};

exports.userLogout = function userLogout (req, res) {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/messages');
    });
};

exports.userLoginGet = function userLoginGet (req, res) {
    const sessionMessages = req.session.messages;
    delete req.session.messages;
    res.render('login', { sessionMessages });
};

exports.userLoginPost = function userLoginPost (req, res, next) {
    authenticateAndRedirect(req, res, next, req.session.route);
};