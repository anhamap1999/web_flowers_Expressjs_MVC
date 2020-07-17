const express = require('express');

const {addCategory, updateCategory, deleteCategory} = require('../controllers/category.controllers');
const {isAuth} = require('../middlewares/auth.middleware');
const {grantAccess} = require('../middlewares/access-control.middleware');

const router = express.Router();
router.get('/list', listCategories);
router.get('/:id', getCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny', 'category'), addCategory);
router.put('/update/:id', grantAccess('updateAny', 'category'), updateCategory);
router.delete('/delete/:id', grantAccess('deleteAny', 'category'), deleteCategory);

module.exports = router;