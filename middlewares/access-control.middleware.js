const accessControl = require('accesscontrol');
const roles = new accessControl();
roles.grant('customer')
    .readOwn('account')
    .updateOwn('account')
    .deleteOwn('account')
    .createOwn('order')
    .readOwn('order')
    .createOwn('order')
    .deleteOwn('order')
    .readOwn('cart')
    .createOwn('cart')
    .deleteOwn('cart');
roles.grant('admin')
    .extend('customer')
    .createAny('flower')
    .updateAny('flower')
    .deleteAny('flower')
    .createAny('category')
    .updateAny('category')
    .deleteAny('category')
    .readAny('account')    
    .deleteAny('account')
    .readAny('order')    
    .readAny('cart')
    
//const {roles} = require('../roles/roles');

exports.grantAccess = (action, resource) => {
    return async(req, res, next) => {
        try {
            const permission = roles.can(req.role)[action](resource);
            if (permission.granted) {
                next();
            } else {
                throw error;
            }
        } catch(error) {
            res.status(403).json({message: 'No permission!'});
        }
    };
};