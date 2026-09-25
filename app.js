const express = require('express');
const env = process.env;
const messageRouter = require('./routes/messageRoutes');

const app = express();

app.get('/', (req, res, next) => {
    res.redirect('/messages');
});

app.use('/messages', messageRouter);

const port = env.PORT || 3000;
app.listen(port || 3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on port', port);
    };
});