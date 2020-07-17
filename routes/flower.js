const express = require('express');

const {listFlowers, getFlower, getFlowerByCategory, addFlower, updateFlower, deleteFlower} = require('../controllers/flower.controllers');
const {isAuth} = require('../middlewares/auth.middleware');
const {grantAccess} = require('../middlewares/access-control.middleware');
const {uploadImage} = require('../middlewares/upload-image.middleware');

const router = express.Router();
router.get('/list', listFlowers);
router.get('/:id', getFlower);
router.get('/', getFlowerByCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny','flower'), addFlower);
router.put('/update/:id', grantAccess('updateAny', 'flower'), updateFlower);
router.delete('/delete/:id', grantAccess('deleteAny', 'flower'), deleteFlower);

module.exports = router;