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
    uuid: {
        type: String,
        required: false
    },
    name : {
        type: String, 
        required: false
    },
    ammount: {
        type: Number,
        require: false
    },
    set: {
        type: String,
        required : false
    },
    imgUrl : {
        front: String,
        back: {
            type : String,
            required : false
        }
    },
    finishes: {
        type: [String],
        required : false
    },
    tags : {
        type : {String},
        required :  false
    }
});

module.exports = mongoose.model('Brew', BrewSchema);