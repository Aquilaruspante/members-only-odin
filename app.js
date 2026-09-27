const path = require('node:path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const env = process.env;
const pgPool = require('./db/pool');
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');
const { isNotAuth } = require('./middleware');

const app = express();

app.use(session({
    store: new pgSession({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: 'not a good secret',
    resave: false,
    saveUninitialized: true,
    name: 'ci',
    cookie: {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}));

require('./config/passport');
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
    res.redirect('/messages');
});

app.use('/messages', messageRouter);
app.use('/register', isNotAuth, userRouter);

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/messages');
    });
});

const port = env.PORT || 3000;
app.listen(port || 3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on port', port);
    };
});