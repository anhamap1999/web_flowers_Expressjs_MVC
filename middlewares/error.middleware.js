const { GeneralError } = require('../utils/error');

exports.handleError = (error, req, res, next) => {
    if (error instanceof GeneralError) {
        res.status(error.getCode()).send(error);
    } else {
        res.status(500).send(new GeneralError(error.message));
    }
};