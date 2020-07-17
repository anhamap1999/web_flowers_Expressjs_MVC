const express = require('express');

const router = express.Router();

const CartControllers = require('../controllers/CartControllers');
const {isAuth} = require('../middlewares/AuthMiddleware');
const {grantAccess} = require('../middlewares/AccessControlMiddleware');

router.use(isAuth);
router.get('/list', grantAccess('readAny', 'cart'), CartControllers.listCarts);
router.get('/:username', grantAccess('readOwn', 'cart'), CartControllers.getCart);
router.post('/add/:username', grantAccess('createOwn', 'cart'), CartControllers.addItem);
router.delete('/delete/:username/:id', grantAccess('deleteOwn', 'cart'), CartControllers.deleteItem);

module.exports = router;