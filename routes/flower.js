const express = require('express');

const FlowerControllers = require('../controllers/FlowerControllers');
const {isAuth} = require('../middlewares/AuthMiddleware');
const {grantAccess} = require('../middlewares/AccessControlMiddleware');
const {uploadImage} = require('../middlewares/UploadImageMiddleware');

const router = express.Router();
router.get('/list', FlowerControllers.listFlowers);
router.get('/:id', FlowerControllers.getFlower);
router.get('/', FlowerControllers.getFlowerByCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny','flower'), FlowerControllers.addFlower);
router.put('/update/:id', grantAccess('updateAny', 'flower'), FlowerControllers.updateFlower);
router.delete('/delete/:id', grantAccess('deleteAny', 'flower'), FlowerControllers.deleteFlower);

module.exports = router;