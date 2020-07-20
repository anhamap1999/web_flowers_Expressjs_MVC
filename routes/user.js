const express = require('express');

const { getUser, updateUser, deleteUser } = require('../controllers/user.controllers');
const { listUsers, getUserByAdmin, deleteUserByAdmin } = require('../controllers/admin.user.controllers');
const { register, login, refreshToken, logout } = require('../controllers/auth.controllers');
const { UserValidator } = require('../validators/user.validator');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');

const router = express.Router();
router.post('/register', UserValidator, register);
router.patch('/login', UserValidator, login);
router.patch('/refresh-token', refreshToken);

router.use(isAuth);
router.get('/', grantAccess('readOwn', 'account'), getUser);
router.get('/list', grantAccess('readAny', 'account'), listUsers);
router.get('/:username', grantAccess('readAny', 'account'), getUserByAdmin);
router.delete('/delete/:username', grantAccess('deleteAny', 'account'), deleteUserByAdmin);
//lack of validator for update
router.put('/update', grantAccess('updateOwn', 'account'), updateUser);
router.patch('/logout', grantAccess('updateOwn', 'account'), logout);
router.delete('/delete', grantAccess('deleteOwn', 'account'), deleteUser);

module.exports = router;