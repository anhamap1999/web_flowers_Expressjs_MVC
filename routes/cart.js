const express = require('express');

const router = express.Router();

const {listCarts, getCart, addItem, deleteItem} = require('../controllers/cart.controllers');
const {isAuth} = require('../middlewares/auth.middleware');
const {grantAccess} = require('../middlewares/access-control.middleware');

router.use(isAuth);
router.get('/list', grantAccess('readAny', 'cart'), listCarts);
router.get('/:username', grantAccess('readOwn', 'cart'), getCart);
router.post('/add/:username', grantAccess('createOwn', 'cart'), addItem);
router.delete('/delete/:username/:id', grantAccess('deleteOwn', 'cart'), deleteItem);

module.exports = router;