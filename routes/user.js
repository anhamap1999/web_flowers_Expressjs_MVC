const express = require('express');

const { getUser, updateUser, deleteUser, updatePassword } = require('../controllers/user.controllers');
const { listUsers, getUserByAdmin, deleteUserByAdmin } = require('../controllers/admin.user.controllers');
const { register, login, refreshToken, logout, forgotPassword, resetPassword } = require('../controllers/auth.controllers');
const { isAuth } = require('../middlewares/auth.middleware');
const { grantAccess } = require('../middlewares/access-control.middleware');
const { handleError } = require('../middlewares/error.middleware');
const { registerValidator, loginValidator, updateUserValidator, forgotPasswordValidator } = require('../validators/user.validators');

const router = express.Router();
router.post('/register', registerValidator, register);
router.patch('/login', loginValidator, login);
router.patch('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(isAuth);
router.get('/', grantAccess('readOwn', 'account'), getUser);
router.get('/list', grantAccess('readAny', 'account'), listUsers);
router.get('/:username', grantAccess('readAny', 'account'), getUserByAdmin);
router.delete('/delete/:username', grantAccess('deleteAny', 'account'), deleteUserByAdmin);
router.put('/update', grantAccess('updateOwn', 'account'), updateUserValidator, updateUser);
router.patch('/update-password', grantAccess('updateOwn', 'account'), updatePassword);
router.patch('/logout', grantAccess('updateOwn', 'account'), logout);
router.delete('/delete', grantAccess('deleteOwn', 'account'), deleteUser);

router.use(handleError);

module.exports = router;