const express = require('express');

const UserControllers = require('../controllers/UserControllers');
const AuthControllers = require('../controllers/AuthControllers');
const {UserValidator} = require('../validators/validator');
const {isAuth} = require('../middlewares/AuthMiddleware');
const {grantAccess} = require('../middlewares/AccessControlMiddleware');

const router = express.Router();
router.post('/register', UserValidator, AuthControllers.register);
router.post('/login', UserValidator, AuthControllers.login);
router.post('/refresh-token', AuthControllers.refreshToken);

router.use(isAuth);
router.get('/:username', grantAccess('readOwn', 'account'), UserControllers.getUser);
router.get('/list', grantAccess('readAny', 'account'), UserControllers.listUsers);
router.put('/update/:username', grantAccess('updateOwn', 'account'), UserControllers.updateUser);
router.get('/logout', grantAccess('readOwn', 'account'), AuthControllers.logout);
router.delete('/delete/:username', grantAccess('deleteOwn', 'account'), UserControllers.deleteUser);

module.exports = router;