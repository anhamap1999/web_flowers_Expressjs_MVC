class GeneralError extends Error {
    constructor(message, key, value, error_message) {
        super();
        this.message = message;
        this.errors = {
            key: key,
            value: value,
            message: error_message
        }
    }
    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        }
        if (this instanceof NotFound) {
            return 404;
        }
        if (this instanceof Unauthorized) {
            return 401;
        }
        if (this instanceof Forbidden) {
            return 403;
        }
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class Unauthorized extends GeneralError { }
class Forbidden extends GeneralError { }

module.exports = { GeneralError, BadRequest, NotFound, Unauthorized, Forbidden };