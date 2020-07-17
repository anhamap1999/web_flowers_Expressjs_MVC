const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ItemSchema = new schema({
    flower_id: {
        type: String, 
        required: true
    },
    quatity: {
        type: Number, 
        min: [1, 'Quatity can not be less than 1!'], 
        required: true
    },
    unit_price: {
        type: Number,
        min: [0, 'Unit price can not be less than 0!'],
        required: true
    }
});

const CartSchema = new schema({
    username: {
        type: String,
        minlength: 8,
        maxlength: 30,
        required: true,
        match: /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
    },
    items: [ItemSchema],
    total_price: {
        type: Number,
        min: 0,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'disabled']
    }
});

module.exports = mongoose.model('cart', CartSchema);