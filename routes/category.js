const express = require('express');

const CategoryControllers = require('../controllers/CategoryControllers');
const {isAuth} = require('../middlewares/AuthMiddleware');
const {grantAccess} = require('../middlewares/AccessControlMiddleware');

const router = express.Router();
router.get('/list', CategoryControllers.listCategories);
router.get('/:id', CategoryControllers.getCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny', 'category'), CategoryControllers.addCategory);
router.put('/update/:id', grantAccess('updateAny', 'category'), CategoryControllers.updateCategory);
router.delete('/delete/:id', grantAccess('deleteAny', 'category'), CategoryControllers.deleteCategory);

module.exports = router;