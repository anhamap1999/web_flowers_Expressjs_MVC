const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CategorySchema = new schema({
    category_name: {
        type: String,
        maxlength: 50,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'disabled']
    }
});

module.exports = mongoose.model('category', CategorySchema);