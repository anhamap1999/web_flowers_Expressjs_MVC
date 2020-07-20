const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ItemSchema = new schema({
    flower_id: {
        type: String,
        required: true
    },
    flower_name: {
        type: String,
        maxlength: 50,
        required: true
    },
    unit_price: {
        type: Number,
        min: [0, 'Unit price can not be less than 0!'],
        required: true
    },
    quantity: {
        type: Number, 
        min: [1, 'Quantity can not be less than 1!'], 
        required: true
    }
});

const OrderSchema = new schema({    
    username: {
        type: String,
        minlength: 8,
        maxlength: 30,
        required: true,
        match: /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
    },        
    bill_address: {
        full_name: {
            type: String,
            maxlength: 50,
            required: true
        },
        address: {
            type: String,
            maxlength: 100,
            required: true
        },
        phone_number: {
            type: String,
            maxlength: 20,
            required: true
        },
        email: {
            type: String,
            maxlength: 50,
            lowercase: true,
            match: [/[\w]+?@[\w]+?\.[a-z]{2,4}/, 'Email must have correct format!'],
            required: true
        }
    },
    shipping_method: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        min: 0,
        required: true
    },
    items: [ItemSchema],
    
    order_date: {
        type: Date, 
        default: Date.now()
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'disabled']
    }
});

module.exports = mongoose.model('order', OrderSchema);