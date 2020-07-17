const express = require('express');

const FlowerControllers = require('../controllers/FlowerControllers');

router = express.Router();
router.get('/', FlowerControllers.searchFlower);

module.exports = router;