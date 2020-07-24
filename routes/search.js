const express = require('express');

const { searchFlower } = require('../controllers/flower.controllers');
const { handleError } = require('../middlewares/error.middleware');

router = express.Router();
router.get('/', searchFlower);

router.use(handleError);

module.exports = router;