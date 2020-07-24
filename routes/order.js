const express = require('express');

const { listOrders, getOrder, placeOrder } = require('../controllers/order.controllers');
const { listOrdersByAdmin, getOrderByAdmin } = require('../controllers/admin.order.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { handleError } = require('../middlewares/error.middleware');
const { orderValidator } = require('../validators/order.validators');

const router = express.Router();

router.use(isAuth);
router.get('/list', grantAccess('readAny', 'order'), listOrdersByAdmin);
router.get('/:id', grantAccess('readAny', 'order'), getOrderByAdmin);
router.get('/list', grantAccess('readOwn', 'order'), listOrders);
router.get('/:id', grantAccess('readOwn', 'order'), getOrder);
router.post('/place-order', grantAccess('createOwn', 'order'), orderValidator, placeOrder);

router.use(handleError);

module.exports = router;