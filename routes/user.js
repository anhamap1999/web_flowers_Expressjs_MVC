const express = require('express');

const {getUser, listUsers, updateUser, deleteUser} = require('../controllers/user.controllers');
const {register, login, refreshToken, logout} = require('../controllers/auth.controllers');
const {UserValidator} = require('../validators/user.validator');
const {isAuth} = require('../middlewares/auth.middleware');
const {grantAccess} = require('../middlewares/access-control.middleware');

const router = express.Router();
router.post('/register', UserValidator, register);
router.post('/login', UserValidator, login);
router.post('/refresh-token', refreshToken);

router.use(isAuth);
router.get('/:username', grantAccess('readOwn', 'account'), getUser);
router.get('/list', grantAccess('readAny', 'account'), listUsers);
router.put('/update/:username', grantAccess('updateOwn', 'account'), updateUser);
router.put('/logout', grantAccess('updateOwn', 'account'), logout);
router.delete('/delete/:username', grantAccess('deleteOwn', 'account'), deleteUser);

module.exports = router;