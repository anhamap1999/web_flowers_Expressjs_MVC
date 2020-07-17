const accessControl = require('accesscontrol');

exports.roles = () => {
    const ac = new accessControl();
    ac.grant('customer')
        .readOwn('account')
        .updateOwn('account')
        .readAny('flower')
        .readAny('category')
        .readOwn('order')
        .createOwn('order')
        .deleteOwn('order')
        .readOwn('cart')
        .updateOwn('cart');
    ac.grant('admin')
        .extend('customer')
        .readAny('account')
        .updateAny('account')
        .createAny('flower')
        .updateAny('flower')
        .deleteAny('flower')
        .createAny('category')
        .updateAny('category')
        .deleteAny('category')
        .readAny('order')
        .updateAny('order')
        .deleteAny('order')
        .readAny('cart')
        .updateAny('cart');
    return ac;
}