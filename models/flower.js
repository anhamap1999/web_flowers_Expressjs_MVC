const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FlowerSchema = new schema({
    category_id: {
        type: String,
        required: true
    },
    flower_name: {
        type: String,
        maxlength: 50,
        required: true,
    },
    search_text: {
        type: String,
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
    },
    image: {
        data: {
            type: Buffer,
        },
        contentType: {
            type: String,
        }
    },
    description: {
        type: String,
        maxlength: 1000,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'disabled']
    }
});
FlowerSchema.indexes({
    flower_name: 'text',
    description: 'text',
    search_text: 'text'
});
module.exports = mongoose.model('flower', FlowerSchema);