const { Router } = require('express');
const userControllers = require('../controllers/userControllers');

const router = new Router();

router.get('/', (req, res, next) => {
    res.render('register');
});

router.post('/', userControllers.userCreate);

module.exports = router;