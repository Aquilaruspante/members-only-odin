const path = require('node:path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const env = process.env;
const pgPool = require('./db/pool');
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');

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

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
    res.redirect('/messages');
});

app.use('/messages', messageRouter);
app.use('/register', userRouter);

const port = env.PORT || 3000;
app.listen(port || 3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on port', port);
    };
});