const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
    price: {
        type: Number,
        required : false
    },
    owned: {
        type: Number,
        required: false
    },
    cardParts : [String],
    faceManaValue : Number,
    finishes : {
        type : [String],
        required : true
    },
    manaValue : {
        type : Number,
        required : true
    },
    signature : String,
    isFunny : Boolean,
    isRebalanced : Boolean,
    faceFlavorName : String,
    originalPrintings : [String],
    rebalancedPrintings : [String],
    securityStamp : String,
    artist : {
        type: String,
        required: false
    },
    asciiName : {
        type: String,
        required: false
    },
    availability : [String],
    borderColor : String,
    colorIdentity : [String],
    colorIndicator : {
        type: [String],
        required: false
    },
    colors : [String],
    edhrecRank : {
        type: Number,
        required: false
    },
    faceName: {
        type: String,
        required: false
    },
    flavorName: {
        type: String,
        required: false
    },
    flavorText: {
        type: String,
        required: false
    },
    foreignData: [{
        faceName: {
            type: String,
            required: false
        },
        flavorText: {
            type: String,
            required: false
        },
        language: String,
        multiverseId: {
            type: String,
            required: false
        },
        name: String,
        text: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        }
    }],
    frameEffects: [String],
    frameVersion: String,
    hand: {
        type: String,
        required: false
    },
    hasContentWarning: {
        type: Boolean,
        required: false
    },
    hasAlternativeDeckLimit: {
        type: Boolean,
        required: false
    },
    identifiers: 
    {
        cardKingdomFoilId: String,
        cardKingdomId: String,
        mcmId: String,
        mcmMetaId: String,
        mtgArenaId: String,
        mtgoFoilId: String,
        mtgoId: String,
        mtgjsonV4Id: String,
        multiverseId: String,
        scryfallId: String,
        scryfallOracleId: String,
        scryfallIllustrationId: String,
        tcgplayerProductId: String
    },
    isAlternative: {
        type: Boolean,
        required: false
    },
    isFullArt: {
        type: Boolean,
        required: false
    },
    isOnlineOnly: {
        type: Boolean,
        required: false
    },
    isOversized: {
        type: Boolean,
        required: false
    },
    isPromo: {
        type: Boolean,
        required: false
    },
    isReprint: {
        type: Boolean,
        required: false
    },
    isReserved: {
        type: Boolean,
        required: false
    },
    isStarter: {
        type: Boolean,
        required: false
    },
    isStorySpotlight: {
        type: Boolean,
        required: false
    },
    isTextless: {
        type: Boolean,
        required: false
    },
    isTimeshifted: {
        type: Boolean,
        required: false
    },
    keywords: {
        type: [String],
        required: false
    },
    layout: String,
    leadershipSkills: {
        type:{
        brawl: Boolean,
        commander: Boolean,
        oathbreaker: Boolean
        },
        required: false
    },
    legalities: {
        brawl: String,
        commander: String,
        duel: String,
        future: String,
        frontier: String,
        historic: String,
        legacy: String,
        modern: String,
        pauper: String,
        penny: String,
        pioneer: String,
        standard: String,
        vintage: String
    },
    life: {
        type: String,
        required: false
    },
    loyalty: {
        type: String,
        required: false
    },
    manaCost: {
        type: String,
        required: false
    },
    name: String,
    number: String,
    originalReleaseDate: {
        type: String,
        required: false
    },
    originalText: {
        type: String,
        required: false
    },
    originalType: {
        type: String,
        required: false
    },
    otherFaceIds: [String],
    power: {
        type: String,
        required: false
    },
    printings:{
        type: [String],
        required: false
    },
    promoTypes: {
        type: [String],
        required: false
    },
    purchaseUrls:{
        cardKingdom: String,
        cardKingdomFoil: String,
        cardmarket: String,
        tcgplayer: String
    },
    rarity: String,
    rulings: [{
        date: String,
        text: String
    }],
    setCode: String,
    side: {
        type: String,
        required: false
    },
    subtypes: [String],
    supertypes: [String],
    text: {
        type: String,
        required: false
    },
    toughness: {
        type: String,
        required: false
    },
    type: String,
    types: [String],
    uuid: String,
    variations: [String],
    watermark: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Card', CardSchema);