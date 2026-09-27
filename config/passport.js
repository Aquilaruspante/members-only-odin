const passport = require('passport');
const { Strategy } = require('passport-local');
const db = require('../db/queries');
const { verifyPassword } = require('../lib/passwordUtils');

passport.use(new Strategy(async (username, password, done) => {
    try {
        const user = await db.userGetByUsername(username);
        if (!user) return done(null, false);

        if (!verifyPassword(password)) return done(null, false);

        return done(null, user);
    } catch (err) {
        return done(err);
    };
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (user_id, done) => {
    try {
        const user = await db.userGetById(user_id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});