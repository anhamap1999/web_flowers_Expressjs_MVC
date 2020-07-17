const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TokenSchema = new schema({
    token: {type: String}
});

const UserSchema = new schema({
    username: {
        type: String,
        minlength: 8,
        maxlength: 30,
        required: true,
        index: true,
        match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 'Username must only contains alphabet, number, underscore and dot. Underscore and dot can not be insinde, at the beginning and the end.']
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 100,        
        required: true,
        //match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?])[A-Za-z\d$@$!%*#?]{6,}$/
    },
    access_tokens: [TokenSchema],
    refresh_tokens: [TokenSchema],
    role: {
        type: String,
        default: 'customer',
        enum: ['customer', 'admin']
    },
    full_name: {
        type: String,
        maxlength: 50
    },
    address: {
        type: String,
        maxlength: 100
    },
    phone_number: {
        type: String,
        maxlength: 20
    },
    email: {
        type: String,
        maxlength: 50,
        lowercase: true,
        match: [/[\w]+?@[\w]+?\.[a-z]{2,4}/, 'Email must have correct format!']
    }
});

module.exports = mongoose.model('user', UserSchema);
