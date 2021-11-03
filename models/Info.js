const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    }, 
    version: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Info', InfoSchema);