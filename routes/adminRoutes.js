const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware');

const router = new Router();

router.get('/', isAdmin, adminController.adminGet);

router.post('/', isAdmin, adminController.adminPost);

module.exports = router;