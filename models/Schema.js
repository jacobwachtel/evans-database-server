const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide a name'],
        trim: true,
        maxLength: [30, 'Name cannot be more than 20 characters'],
    },
    description: {
        type: String,
        required: [true, 'must provide a description'],
        maxLength: [150, 'Cannot be longer than 150 characters'],
    },
    image: {
        type: String,
    },
    owner: {
        type: String,
        required: [true, 'must provide an owner'],
        maxLength: [20, 'owner cannot be longer than 20 characters'],
    },

})


module.exports = mongoose.model('tool', ToolSchema);