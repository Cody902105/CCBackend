const mongoose = require('mongoose');

const BrewSchema = mongoose.Schema({
    deck: {
        type: String,
        required: true
    }, 
    uuid: {
        type: String,
        required: true
    },
    name : {
        type: String, 
        required: true
    },
    ammount: {
        type: Number,
        require: true
    },
    set: {
        type: String,
        required : false
    },
    finishes: {
        type: Array[String],
        required : false
    }
    
});

module.exports = mongoose.model('Brew', BrewSchema);