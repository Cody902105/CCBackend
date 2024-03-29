const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const SetList = require('../models/SetList');
const PAGE_SIZE = 102;
const GROUP_FUNCT = 
    {
      '$group': {
        '_id': '$name', 
        'identifiers': {
          '$first': '$identifiers'
        }, 
        'legalities': {
          '$first': '$legalities'
        }, 
        'purchaseUrls': {
          '$first': '$purchaseUrls'
        }, 
        'price': {
          '$first': '$price'
        },
        'artist': {
          '$first': '$artist'
        }, 
        'availability': {
          '$first': '$availability'
        }, 
        'borderColor': {
          '$first': '$borderColor'
        }, 
        'colorIdentity': {
          '$first': '$colorIdentity'
        }, 
        'colorIndicator': {
          '$first': '$colorIndicator'
        }, 
        'colors': {
          '$first': '$colors'
        }, 
        'convertedManaCost': {
          '$first': '$convertedManaCost'
        }, 
        'edhrecRank': {
          '$first': '$edhrecRank'
        }, 
        'flavorText': {
          '$first': '$flavorText'
        }, 
        'foreignData': {
          '$first': '$foreignData'
        }, 
        'frameEffects': {
          '$first': '$frameEffects'
        }, 
        'frameVersion': {
          '$first': '$frameVersion'
        }, 
        'hasFoil': {
          '$first': '$hasFoil'
        }, 
        'hasNonFoil': {
          '$first': '$hasNonFoil'
        }, 
        'isReserved': {
          '$first': '$isReserved'
        }, 
        'keywords': {
          '$first': '$keywords'
        }, 
        'layout': {
          '$first': '$layout'
        }, 
        'leadershipSkills': {
          '$first': '$leadershipSkills'
        }, 
        'manaCost': {
          '$first': '$manaCost'
        }, 
        'name': {
          '$first': '$name'
        }, 
        'number': {
          '$first': '$number'
        }, 
        'originalText': {
          '$first': '$originalText'
        }, 
        'originalType': {
          '$first': '$originalType'
        }, 
        'otherFaceIds': {
          '$first': '$otherFaceIds'
        }, 
        'power': {
          '$first': '$power'
        }, 
        'printings': {
          '$first': '$printings'
        }, 
        'promoTypes': {
          '$first': '$promoTypes'
        }, 
        'rarity': {
          '$first': '$rarity'
        }, 
        'rulings': {
          '$first': '$rulings'
        }, 
        'setCode': {
          '$first': '$setCode'
        }, 
        'subtypes': {
          '$first': '$subtypes'
        }, 
        'supertypes': {
          '$first': '$supertypes'
        }, 
        'text': {
          '$first': '$text'
        }, 
        'toughness': {
          '$first': '$toughness'
        }, 
        'type': {
          '$first': '$type'
        }, 
        'types': {
          '$first': '$types'
        }, 
        'uuid': {
          '$first': '$uuid'
        }, 
        'variations': {
          '$first': '$variations'
        }
      }
    }
  ;
//Returnes json {cards: [Cards]}. limited by 20 
router.get('/', async (req,res) =>{
    try{
        const Cards = await Card.find().limit(20);
        res.json({cards: Cards});
    }catch(err){
        res.json({message:err});
    }
});
//Returnes Promise based on posted card, Will update if the card already exists
router.post('/', async (req,res) => {
    const postCard = new Card({
        artist : req.body.artist,
        asciiName : req.body.asciiName,
        availability : req.body.availability,
        borderColor : req.body.borderColor,
        colorIdentity : req.body.colorIdentity,
        colorIndicator : req.body.colorIndicator,
        colors : req.body.colors,
        convertedManaCost : req.body.convertedManaCost,
        edhrecRank : req.body.edhrecRank,
        faceConvertedManaCost : req.body.faceConvertedManaCost,
        faceName: req.body.faceName,
        flavorName: req.body.flavorName,
        flavorText: req.body.flavorText,
        foreignData: req.body.foreignData,
        frameEffects: req.body.frameEffects,
        frameVersion: req.body.frameVersion,
        hand: req.body.hand,
        hasContentWarning: req.body.hasContentWarning,
        hasFoil: req.body.hasFoil,
        hasAlternativeDeckLimit: req.body.hasAlternativeDeckLimit,
        hasNonFoil: req.body.hasNonFoil,
        identifiers: req.body.identifiers,
        isAlternative: req.body.isAlternative,
        isFullArt: req.body.isFullArt,
        isOnlineOnly: req.body.isOnlineOnly,
        isOversized: req.body.isOversized,
        isPromo: req.body.isPromo,
        isReprint: req.body.isReprint,
        isReserved: req.body.isReserved,
        isStarter: req.body.isStarter,
        isStorySpotlight: req.body.isStorySpotlight,
        isTextless: req.body.isTextless,
        isTimeshifted: req.body.isTimeshifted,
        keywords: req.body.keywords,
        layout: req.body.layout,
        leadershipSkills: req.body.leadershipSkills,
        legalities: req.body.legalities,
        life: req.body.life,
        loyalty: req.body.loyalty,
        manaCost: req.body.manaCost,
        name: req.body.name,
        number: req.body.number,
        originalReleaseDate: req.body.originalReleaseDate,
        originalText: req.body.originalText,
        originalType: req.body.originalType,
        otherFaceIds: req.body.otherFaceIds,
        power: req.body.power,
        printings:req.body.printings,
        promoTypes: req.body.promoTypes,
        purchaseUrls: req.body.purchaseUrls,
        rarity: req.body.rarity,
        rulings: req.body.rulings,
        setCode: req.body.setCode,
        side: req.body.side,
        subtypes: req.body.subtypes,
        supertypes: req.body.supertypes,
        text: req.body.text,
        toughness: req.body.toughness,
        type: req.body.type,
        types: req.body.types,
        uuid: req.body.uuid,
        variations: req.body.variations,
        watermark: req.body.watermark
    });
    try{
        CardExists = await Card.exists({uuid : postCard.uuid});
        if(!CardExists){
            const saveCard = await postCard.save();
            res.json(saveCard.name + " Added");
        }else{
            try{
                const updatedCard = await Card.updateOne({uuid : postCard.uuid},{$set: {
                    artist : req.body.artist,
                    asciiName : req.body.asciiName,
                    availability : req.body.availability,
                    borderColor : req.body.borderColor,
                    colorIdentity : req.body.colorIdentity,
                    colorIndicator : req.body.colorIndicator,
                    colors : req.body.colors,
                    convertedManaCost : req.body.convertedManaCost,
                    edhrecRank : req.body.edhrecRank,
                    faceConvertedManaCost : req.body.faceConvertedManaCost,
                    faceName: req.body.faceName,
                    flavorName: req.body.flavorName,
                    flavorText: req.body.flavorText,
                    foreignData: req.body.foreignData,
                    frameEffects: req.body.frameEffects,
                    frameVersion: req.body.frameVersion,
                    hand: req.body.hand,
                    hasContentWarning: req.body.hasContentWarning,
                    hasFoil: req.body.hasFoil,
                    hasAlternativeDeckLimit: req.body.hasAlternativeDeckLimit,
                    hasNonFoil: req.body.hasNonFoil,
                    identifiers: req.body.identifiers,
                    isAlternative: req.body.isAlternative,
                    isFullArt: req.body.isFullArt,
                    isOnlineOnly: req.body.isOnlineOnly,
                    isOversized: req.body.isOversized,
                    isPromo: req.body.isPromo,
                    isReprint: req.body.isReprint,
                    isReserved: req.body.isReserved,
                    isStarter: req.body.isStarter,
                    isStorySpotlight: req.body.isStorySpotlight,
                    isTextless: req.body.isTextless,
                    isTimeshifted: req.body.isTimeshifted,
                    keywords: req.body.keywords,
                    layout: req.body.layout,
                    leadershipSkills: req.body.leadershipSkills,
                    legalities: req.body.legalities,
                    life: req.body.life,
                    loyalty: req.body.loyalty,
                    manaCost: req.body.manaCost,
                    name: req.body.name,
                    number: req.body.number,
                    originalReleaseDate: req.body.originalReleaseDate,
                    originalText: req.body.originalText,
                    originalType: req.body.originalType,
                    otherFaceIds: req.body.otherFaceIds,
                    power: req.body.power,
                    printings:req.body.printings,
                    promoTypes: req.body.promoTypes,
                    purchaseUrls: req.body.purchaseUrls,
                    rarity: req.body.rarity,
                    rulings: req.body.rulings,
                    setCode: req.body.setCode,
                    side: req.body.side,
                    subtypes: req.body.subtypes,
                    supertypes: req.body.supertypes,
                    text: req.body.text,
                    toughness: req.body.toughness,
                    type: req.body.type,
                    types: req.body.types,
                    variations: req.body.variations,
                    watermark: req.body.watermark
                }});
                res.json(updatedCard);
            }catch(baderr){
                res.send(baderr)
            }
        }
    }catch(err){
        res.json({message: err + " is this error"});
    }
});
//Returnes json {cards: [Cards]}. Type Array[Objects] err returns a blank array to avoid crashes
router.get('/search', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        if (!req.query.text && !req.query.unique && !req.query.price){
          searchReturn = searchReturn.sort({$natural : -1});
        }
        if (req.query.price && !req.query.unique){
          if(req.query.price === "1"){
            searchReturn = searchReturn.sort({price : 1});
          }else{
            searchReturn = searchReturn.sort({price : -1});
          }
        }
        if (req.query.unique){
            searchReturn = searchReturn.limit(PAGE_SIZE);
            var matchQuery = searchReturn.getFilter();
            var searchFunction = [{'$match': matchQuery}];
            searchFunction.push(GROUP_FUNCT);
            if (req.query.price){
              if(req.query.price === "1"){
                searchFunction.push({$sort:{price : 1}})
              }else{
                searchFunction.push({$sort:{price : -1}})
              }
            }
            if(req.query.next > 0){
              var skipping = req.query.next * PAGE_SIZE;
              searchFunction.push({'$skip': skipping});
            }
            searchFunction.push({'$limit': PAGE_SIZE});
            var uniqueSearch = await Card.aggregate(searchFunction).allowDiskUse(true).exec();
            res.json({cards: uniqueSearch});
          }else{
            searchReturn = await searchReturn.limit(PAGE_SIZE).exec();
            res.json({cards: searchReturn});
          }
    }catch(err){
        res.json({cards: []});
    }
});
//Returnes json {message: [Sets]}. All sets 
router.get('/sets', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('setCode').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returns json {message: [{code : "" , keyruneCode : ""}]}. All keyrune key value pairs
router.get('/keyruneCodes', async (req,res) => {
  try{
      var searchReturn = await SetList.find({"code":{$exists:true}},{"code":1, "keyruneCode":1,"_id" : 0});
      res.json({message : searchReturn});
  }catch(err){
      res.json({message : err});
  }
});
//Returns the spesific set name based on the set code
router.get('/setName', async (req,res) => {
  try{
      searchReturn = "";
        if(req.query.code){
          var code = req.query.code.toUpperCase();
          var searchReturn = await SetList.findOne({"code": code},{"name":1, "_id" : 0});
        } 
      res.json({message : searchReturn});
  }catch(err){
      res.json({message : err});
  }
});
//Returnes json {message: [Colors]}. All Colors
router.get('/colors', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('colors').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [Types]}. All types 
router.get('/types', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('types').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [SubTypes]}. All subtypes
router.get('/subtypes', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('subtypes').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [SuperTypes]}. All supertypes
router.get('/supertypes', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('supertypes').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [Rarity]}. All Rarites
router.get('/rarity', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('rarity').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [Avalability]}. All Avalabilities
router.get('/availability', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('availability').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returnes json {message: [Keywords]}. All Keywords
router.get('/keywords', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        searchReturn = await searchReturn.distinct('keywords').exec();
        res.json({message: searchReturn});
    }catch(err){
        res.json({message : err});
    }
});
//Returns json {returnCount : int}. The number of total cards in the query
router.get('/count', async (req,res) => {
    try{
        var searchReturn = applyFilters(req.query);
        if (req.query.unique){
            searchReturn = searchReturn.limit(PAGE_SIZE);
            var matchQuery = searchReturn.getFilter();
            var searchFunction = [{'$match': matchQuery}];
            searchFunction.push(GROUP_FUNCT);
            searchFunction.push({'$count' : 'returnCount'});
            var uniqueSearch = await Card.aggregate(searchFunction).allowDiskUse(true).exec();
            res.json(uniqueSearch[0]);
        }else{
                searchReturn = await searchReturn.count().exec();
                res.json({returnCount: searchReturn});
            }
    }catch(err){
        res.json({message: err});
        console.log(err);
    }
});
//Over arching query function implimented by all functions to host filtering
function applyFilters(query) {
    try{
    var searchReturn = Card.find({});
    if (query.text && !query.price){
        searchReturn = Card.find({$text: {$search: query.text, $caseSensitive: false}}).sort({score:{$meta:"textScore"}});
    }else if (query.text){
      searchReturn = Card.find({$text: {$search: query.text, $caseSensitive: false}});
    }
    if(query.userName && query.deckName){
        searchReturn = searchReturn.where('brew.deck').equals(query.deckName);
        searchReturn = searchReturn.where('brew.user').equals(query.userName);
        searchReturn = searchReturn.where('brew.ammount').gt(0);
    }else if(query.userName && query.owned){
        searchReturn = searchReturn.where('brew.user').equals(query.userName);
        searchReturn = searchReturn.where('brew.ammount').gt(0);
    }
    if (query.set){
        searchReturn = searchReturn.where('setCode').equals(query.set.toUpperCase());
    }
    if (query.supertype){
        searchReturn = searchReturn.where('supertypes').equals(query.supertype);
    }
    if (query.subtype){
        searchReturn = searchReturn.where('subtypes').equals(query.subtype);
    }
    if (query.type){
        searchReturn = searchReturn.where('types').equals(query.type);
    }
    if (query.rarity){
        searchReturn = searchReturn.where('rarity').equals(query.rarity);
    }
    if (query.artist){
        searchReturn = searchReturn.where('artist').equals(query.artist);
    }
    if (query.color){
        var colorReqArray = [];
        if (query.color != 0){
            for (cooler in query.color){
                colorReqArray.push({colorIdentity:query.color[cooler]});
            }
            searchReturn = searchReturn.and(colorReqArray);
        }else{
            searchReturn = searchReturn.where('colorIdentity').equals([]);
        }
    }
    if (query.availability){
        searchReturn = searchReturn.where('availability').equals(query.availability);
    }
    if (query.isAlternative){
        searchReturn = searchReturn.where('isAlternative').equals(query.isAlternative);
    }
    if (query.isFullArt){
        searchReturn = searchReturn.where('isFullArt').equals(query.isFullArt);
    }
    if (query.isPromo){
        searchReturn = searchReturn.where('isPromo').equals(query.isPromo);
    }
    if (query.isReprint){
        searchReturn = searchReturn.where('isReprint').equals(query.isReprint);
    }
    if (query.isReserved){
        searchReturn = searchReturn.where('isReserved').equals(query.isReserved);
    }
    if (query.isStarter){
        searchReturn = searchReturn.where('isStarter').equals(query.isStarter);
    }
    if (query.isStorySpotlight){
        searchReturn = searchReturn.where('isStorySpotlight').equals(query.isStorySpotlight);
    }
    if (query.isTextless){
        searchReturn = searchReturn.where('isTextless').equals(query.isTextless);
    }
    if (query.isTimeshifted){
        searchReturn = searchReturn.where('isTimeshifted').equals(query.isTimeshifted);
    }
    if (query.watermark){
        searchReturn = searchReturn.where('watermark').equals(query.watermark);
    }
    if (query.hasAlternativeDeckLimit){
        searchReturn = searchReturn.where('hasAlternativeDeckLimit').equals(query.hasAlternativeDeckLimit);
    }
    if (query.borderColor){
        searchReturn = searchReturn.where('borderColor').equals(query.borderColor);
    }
    if (query.keywords){
        searchReturn = searchReturn.where('keywords').equals(query.keywords);
    }
    if (query.legalities){//key must be capatalized for some reason
        searchReturn = searchReturn.where('legalities.'+ query.legalities.toLowerCase()).equals('Legal');
    }
    if (query.next && query.next > 0){
        searchReturn = searchReturn.skip((query.next*PAGE_SIZE));
    }
    return searchReturn;
}catch(err){
    console.log(err);
}
}
module.exports = router;