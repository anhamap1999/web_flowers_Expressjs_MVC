const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FlowerSchema = new schema({
    category_id: {
        type: String,
        maxlength: 50,
        required: true
    },
    flower_name: {
        type: String,
        maxlength: 50,
        required: true,
    },
    search_text: {
        type: String,//flower_name + description
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
        image_name: {
            type: String,
            required: true
        },
        image_path: {
            type: String,
            required: true,
            default: './uploads'
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