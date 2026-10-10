const crypto = require('node:crypto');
const db = require('../db/queries');
const { genPassword } = require('../lib/passwordUtils');
const passport = require('passport');
const ExpressError = require('../expressError');
const { matchedData, validationResult } = require('express-validator');

function authenticateAndRedirect(req, res, next, route) {
    if (!route) route = '/';
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            console.log('here');
            try {
                req.session.messages = { type: 'error', message: 'Wrong credentials!' };
                console.log(req.session);
                return req.session.save(err => {
                    console.log('2nd', req.session);
                    if (err) return next(err);
                    res.redirect('/user/login');
                });
            } catch(err) {
                next(err);
            }
            
        };
        req.login(user, err => {
            if (err) return next(err);
            req.session.messages = { type: 'success', message: `Welcome ${user.username}` };
            return req.session.save(err => {
                if (err) return next(err);  
                res.redirect(`/messages${route}`);
            });
        });
    })(req, res, next);
};

exports.userCreateGet = function userCreateGet (req, res, next) {
    const sessionMessages = req.session.messages;
    delete req.session.messages;
    console.log('messages', sessionMessages);
    res.render('register', { sessionMessages });
};

exports.userCreate = async function userCreate(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            const { firstname, lastname, username, password } = matchedData(req);
            const { salt, genHash } = genPassword(password);

            await db.userCreate(firstname, lastname, username, genHash, salt);
            const user = await db.userGetByUsername(username);
            req.login(user, (err) => {
                if (err) return next(err);
                req.session.messages = { type: 'success', message: 'User created succesfully!'};
                return req.session.save(err => {
                    if (err) return next(err);
                    return res.redirect('/messages');
                });
            });
        } catch (err) {
            console.log('error', err);
            req.session.messages = { type: 'error', message: 'Oops! Something went wrong cane!'};
            return req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/user/register');
            });
        };
    } else {
        const errors = result.array();
        console.log('errors', errors)
        req.session.messages = { type: 'error', message: errors[0].msg };
        return req.session.save(err => {
            if (err) returnnext(err);
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
    const sessionMessages = req.session.messages;
    delete req.session.messages;
    res.render('login', { sessionMessages });
};

exports.userLoginPost = function userLoginPost (req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            authenticateAndRedirect(req, res, next, req.session.route);
        } catch (err) {
            console.log(err);
            const error = new ExpressError();
            next(error);
        };
    } else {
        const errors = result.array();
        console.log(errors);
        req.session.messages = { type: 'error', message: `${errors[0].msg}`};
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect('/user/login');
        })
    };
};
    