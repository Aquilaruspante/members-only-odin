const path = require('node:path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const methodOverride = require('method-override');
const env = process.env;
const pgPool = require('./db/pool');
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const memberRouter = require('./routes/memberRoutes');
const { exposeUser } = require('./middleware');

const app = express();

/*---------------------------------- Session config ---------------------------*/

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

/*------------------------------- General middleware ---------------------------*/

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(exposeUser);

/*------------------------------- View Engine settings --------------------------*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*-------------------------------- Routes --------------------------------------*/

app.get('/', (req, res, next) => {
    res.redirect('/messages');
});

app.use('/messages', messageRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/members', memberRouter);

app.all('/{*splat}', (req, res) => {
    const status = '404';
    res.status(404).render('error', { status, message: 'Page not found!' });
});

/*------------------------------ Start Server -----------------------------------*/

const port = env.PORT || 3000;
app.listen(port || 3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on port', port);
    };
});