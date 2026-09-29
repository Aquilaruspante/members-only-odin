const { Router } = require('express');
const messageControllers = require('../controllers/messageController');
const { isAuth } = require('../middleware');

const router = new Router();

router.get('/', messageControllers.getAllMessages);

router.get('/new', isAuth, messageControllers.messageCreateGet);

router.post('/new', isAuth, messageControllers.messageCreatePost);

module.exports = router;