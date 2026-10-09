const { Router } = require('express');
const messageControllers = require('../controllers/messageController');
const { isAuth, isAdmin } = require('../middleware');
const { messageValidator } = require('../validator');

const router = new Router({ mergeParams: true });

router.get('/', messageControllers.getAllMessages);

router.get('/new', isAuth, messageControllers.messageCreateGet);

router.post('/new', isAuth, messageValidator, messageControllers.messageCreatePost);

router.delete('/:id', isAuth, isAdmin,  messageControllers.messageDelete);

module.exports = router;