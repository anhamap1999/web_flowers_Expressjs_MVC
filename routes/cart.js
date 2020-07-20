const express = require('express');

const router = express.Router();

const { getCart, addItem, deleteItem } = require('../controllers/cart.controllers');
const { listCarts } = require('../controllers/admin.cart.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { cartValidator } = require('../validators/cart.validators');

router.use(isAuth);
router.get('/list', grantAccess('readAny', 'cart'), listCarts);
router.get('/', grantAccess('readOwn', 'cart'), getCart);
router.post('/add', grantAccess('createOwn', 'cart'), cartValidator, addItem);
router.delete('/delete/:id', grantAccess('deleteOwn', 'cart'), deleteItem);

module.exports = router;