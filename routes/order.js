const express = require('express');

const {listOrders, getOrder, placeOrder, deleteOrder} = require('../controllers/order.controllers');
const {isAuth} = require('../middlewares/auth.middleware');
const {grantAccess} = require('../middlewares/access-control.middleware');

const router = express.Router();

router.use(isAuth);
router.get('/:username/list', grantAccess('readOwn', 'order'), listOrders);
router.get('/:username/:id', grantAccess('readOwn', 'order'), getOrder);
router.post('/place-order', grantAccess('createOwn', 'order'), placeOrder);
router.delete('/delete/:id', grantAccess('deleteOwn', 'order'), deleteOrder);

module.exports = router;