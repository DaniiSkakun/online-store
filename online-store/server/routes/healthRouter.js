const Router = require('express');
const router = new Router();
const healthController = require('../controllers/healthController');

router.get('/db', healthController.db);

module.exports = router;
