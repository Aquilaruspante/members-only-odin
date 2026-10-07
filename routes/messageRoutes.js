const { Router } = require('express');
const messageControllers = require('../controllers/messageController');
const { isAuth } = require('../middleware');

const router = new Router({ mergeParams: true });

router.get('/', messageControllers.getAllMessages);

router.get('/new', isAuth, messageControllers.messageCreateGet);

router.post('/new', isAuth, messageControllers.messageCreatePost);

router.delete('/:id', messageControllers.messageDelete);

module.exports = router;