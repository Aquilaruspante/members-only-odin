const { Router } = require('express');
const memberControllers = require('../controllers/membersController');
const { isAuth } = require('../middleware');

const router = new Router();

router.get('/', isAuth,  memberControllers.memberGet);

router.post('/', isAuth,  memberControllers.memberPost);

module.exports = router;