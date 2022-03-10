const mongoose = require('mongoose');

const BrewSchema = mongoose.Schema({
    deck: {
        deck : {
            type : String,
            required : true    
        },
        user: {
            type : String,
            required : true    
        }
    }, 
    meta : {
        format : String,
        leader : String,
        required: false
    },
});

module.exports = mongoose.model('Brew', BrewSchema);