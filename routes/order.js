const express = require('express');

const OrderControllers = require('../controllers/OrderControllers');
const {isAuth} = require('../middlewares/AuthMiddleware');
const {grantAccess} = require('../middlewares/AccessControlMiddleware');

const router = express.Router();

router.use(isAuth);
router.get('/:username/list', grantAccess('readOwn', 'order'), OrderControllers.listOrders);
router.get('/:username/:id', grantAccess('readOwn', 'order'), OrderControllers.getOrder);
router.post('/place-order', grantAccess('createOwn', 'order'), OrderControllers.placeOrder);
router.delete('/delete/:id', grantAccess('deleteOwn', 'order'), OrderControllers.deleteOrder);

module.exports = router;