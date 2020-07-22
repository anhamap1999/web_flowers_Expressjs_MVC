const { model } = require("../models/flower");

class Result {
    constructor(data, message, totalPage) {
        this.data = data;
        this.message = message;
        this.totalPage = totalPage && totalPage >= 1 ? totalPage : 1
    }
}

module.exports = Result;