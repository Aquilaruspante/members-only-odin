const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const { isNotAuth, isAuth } = require('../middleware');
const { loginValidator, registerValidator } = require('../validator');

const router = new Router();

/*--------------------------------------- Register User -----------------------------*/

router.get('/register', isNotAuth, userControllers.userCreateGet);

router.post('/register', isNotAuth, registerValidator, userControllers.userCreate);

/*--------------------------------------- Authenticate User -------------------------*/

router.get('/logout', isAuth, userControllers.userLogout);

router.get('/login', isNotAuth, userControllers.userLoginGet);

router.post('/login', isNotAuth, loginValidator, userControllers.userLoginPost);

module.exports = router;