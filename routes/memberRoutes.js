const { Router } = require('express');
const memberControllers = require('../controllers/membersController');

const router = new Router();

router.get('/', memberControllers.memberGet);

router.post('/', memberControllers.memberPost);

module.exports = router;