const { Router } = require('express');
const messageControllers = require('../controllers/messageController');

const router = new Router();

router.get('/', messageControllers.getAllMessages);


module.exports = router;