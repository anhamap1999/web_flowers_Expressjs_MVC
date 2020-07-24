const express = require('express');

const { listCategories, getCategory } = require('../controllers/category.controllers');
const { addCategory, updateCategory, deleteCategory } = require('../controllers/admin.category.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { handleError } = require('../middlewares/error.middleware');
const { categoryValidator } = require('../validators/category.validators');

const router = express.Router();
router.get('/list', listCategories);
router.get('/:id', getCategory);

router.use(isAuth);
router.post('/add', grantAccess('createAny', 'category'), categoryValidator, addCategory);
router.put('/update/:id', grantAccess('updateAny', 'category'), categoryValidator, updateCategory);
router.delete('/delete/:id', grantAccess('deleteAny', 'category'), deleteCategory);

router.use(handleError);

module.exports = router;