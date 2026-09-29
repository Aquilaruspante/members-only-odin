const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const { isNotAuth } = require('../middleware');

const router = new Router();

/*--------------------------------------- Register User -----------------------------*/

router.get('/register', isNotAuth, userControllers.userCreateGet);

router.post('/register', isNotAuth, userControllers.userCreate);

/*--------------------------------------- Authenticate User -------------------------*/

router.get('/logout', userControllers.userLogout);

router.get('/login', isNotAuth, userControllers.userLoginGet);

router.post('/login', isNotAuth, userControllers.userLoginPost);

module.exports = router;