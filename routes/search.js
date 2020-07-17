const express = require('express');

const {searchFlower} = require('../controllers/flower.controllers');

router = express.Router();
router.get('/', searchFlower);

module.exports = router;