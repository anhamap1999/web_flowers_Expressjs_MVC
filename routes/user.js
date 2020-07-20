const express = require('express');

const { getUser, updateUser, deleteUser } = require('../controllers/user.controllers');
const { listUsers, getUserByAdmin, deleteUserByAdmin } = require('../controllers/admin.user.controllers');
const { register, login, refreshToken, logout } = require('../controllers/auth.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { registerValidator, loginValidator, updateUserValidator } = require('../validators/user.validators');

const router = express.Router();
router.post('/register', registerValidator, register);
router.patch('/login', loginValidator, login);
router.patch('/refresh-token', refreshToken);

router.use(isAuth);
router.get('/', grantAccess('readOwn', 'account'), getUser);
router.get('/list', grantAccess('readAny', 'account'), listUsers);
router.get('/:username', grantAccess('readAny', 'account'), getUserByAdmin);
router.delete('/delete/:username', grantAccess('deleteAny', 'account'), deleteUserByAdmin);
//lack of validator for update
router.put('/update', grantAccess('updateOwn', 'account'), updateUserValidator, updateUser);
router.patch('/logout', grantAccess('updateOwn', 'account'), logout);
router.delete('/delete', grantAccess('deleteOwn', 'account'), deleteUser);

module.exports = router;