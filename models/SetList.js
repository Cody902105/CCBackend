const mongoose = require('mongoose');

const SetSchema = mongoose.Schema({
    baseSetSize : {
        type: Number,
        required: true
    }, 
    block: String,
    code : {
        type: String,
        required: true
    }, 
    codeV3 : String,
    isForeignOnly : String,
    isFoilOnly : {
        type: Boolean,
        required: true
    }, 
    isNonFoilOnly : Boolean,
    isOnlineOnly : {
        type: Boolean,
        required: true
    }, 
    isPaperOnly : Boolean,
    isPartialPreview : Boolean,
    keyruneCode : {
        type : String,
        required : true
    },
    mcmId : Number,
    mcmIdExtras : Number,
    mcmName : String,
    mtgoCode : String,
    name : {
        type : String,
        required : true
    },
    parentCode : String,
    releaseDate : {
        type : String,
        required : true
    },
    sealedProduct : {},
    tcgplayerGroupId : Number,
    totalSetSize : { 
        type : Number,
        required : true
    },
    translations : {},
    type : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('SetList', SetSchema);