const express = require('express');

const { listFlowers, getFlower, getFlowerByCategory } = require('../controllers/flower.controllers');
const { addFlower, updateFlower, deleteFlower } = require('../controllers/admin.flower.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { uploadImage } = require('../middlewares/upload-image.middleware');
const { flowerValidator } = require('../validators/flower.validators');

const router = express.Router();
router.get('/list', listFlowers);
router.get('/:id', getFlower);
router.get('/', getFlowerByCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny', 'flower'), flowerValidator, uploadImage, addFlower);
router.put('/update/:id', grantAccess('updateAny', 'flower'), flowerValidator, uploadImage, updateFlower);
router.delete('/delete/:id', grantAccess('deleteAny', 'flower'), deleteFlower);

module.exports = router;