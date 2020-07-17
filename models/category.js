const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CategorySchema = new schema({
    category_name: {
        type: String,
        maxlength: 50,
        required: true},
});

module.exports = mongoose.model('category', CategorySchema);