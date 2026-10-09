const crypto = require('node:crypto');
const db = require('../db/queries');
const { genPassword } = require('../lib/passwordUtils');
const passport = require('passport');
const ExpressError = require('../expressError');

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
            req.session.save(err => {
                if (err) return next(err);
                return res.redirect('/messages');
            });
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
    try {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/messages');
        });
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};

exports.userLoginGet = function userLoginGet (req, res) {
    console.log('in login', req.session)
    const sessionMessages = req.session.messages;
    delete req.session.messages;
    res.render('login', { sessionMessages });
};

exports.userLoginPost = function userLoginPost (req, res, next) {
    try {
        authenticateAndRedirect(req, res, next, req.session.route);
    } catch (err) {
        console.log(err);
        const error = new ExpressError();
        next(error);
    };
};