const express = require('express');
const env = process.env;

const app = express();

const port = env.PORT || 3000;
app.listen(port || 3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on port', port);
    };
});