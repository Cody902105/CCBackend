const e = require('connect-timeout');
const { query } = require('express');
const express = require('express');
const router = express.Router();
const Brew = require('../models/Brew');
const Card = require('../models/Card');

//returns if the collection was created true / false
router.get('/create', async (req,res) => {
    try{
        formatName = '';
        leaderName = '';
        if(req.query.leader){
            leaderName = req.query.leader;
        }
        if(req.query.format){
            formatName = req.query.format;
        }
        if (req.query.deckName && req.query.userName){
            var newDeck = await Brew.exists({deck :{ deck : req.query.deckName, user : req.query.userName}});
            if(!newDeck){
                await Brew.create({
                    deck: {
                        deck : req.query.deckName,
                        user : req.query.userName
                    },
                    meta: {
                        format: formatName,
                        leader: leaderName
                    }
                });
                res.json({response: true});
            }else{
                res.json({response: false});
            }
        }else{
            res.json({response: false});
        }
    }catch(err){
        console.log(err);
        res.json({response: false});
    }
});
//removes a deck
router.get('/removeDeck', async (req,res) => {
    try{
        if(req.query.deckName && req.query.userName){
            await Brew.deleteOne({deck : {deck : req.query.deckName, user : req.query.userName}});
            await Card.updateMany({deck : {deck : req.query.deckName, user : req.query.userName}},{$pull : {brew : {deck : req.query.deckName, user : req.query.userName}}});
            res.json({message: "Success, removed " + req.query.deckName + " for User " + req.query.userName});
        }else{
            res.json({message: "Failed, need a deckName"});
        }
    }catch(err){
        console.log(err);
    }
});
//updates a card to include data about decks and locations
router.get('/add', async (req,res) => {
    try{
        var cardAmmount = 1;
        if(req.query.deckName && req.query.userName && req.query.uuid){
            if (req.query.ammount){
                cardAmmount = req.query.ammount;
            }
            var deckExists = await Brew.exists({deck:{deck : req.query.deckName, user:req.query.userName}});
            if(deckExists){
                var CardExists = await Card.exists({uuid:req.query.uuid});
                if(CardExists){
                    var cardDeckstats = await Card.findOne({uuid:req.query.uuid},{brew:1, _id:0});
                    pass = true;
                    elementCount = -1;
                    cardDeckstats["brew"].forEach(element => {
                        if (element.user === req.query.userName && element.deck === req.query.deckName){
                            pass = false;
                            elementCount++;
                        }
                    });
                    if(pass){
                        cardDeckstats.brew.push({deck : req.query.deckName, user : req.query.userName, ammount : cardAmmount});
                        var card = await Card.findOne({uuid:req.query.uuid},{brew:0});
                        card["brew"] = cardDeckstats["brew"];
                        await Card.updateOne({uuid:req.query.uuid},card);
                        res.json({message : "Card added"});
                    }else{
                        currentAmmount = cardDeckstats.brew[elementCount]["ammount"];
                        cardAmmount = cardAmmount + currentAmmount;
                        cardDeckstats.brew[elementCount] = {deck : req.query.deckName, user : req.query.userName, ammount : cardAmmount};
                        var card = await Card.findOne({uuid:req.query.uuid},{brew:0});
                        card["brew"] = cardDeckstats["brew"];
                        await Card.updateOne({uuid:req.query.uuid},card);
                        res.json({message: "card already in collection/deck adding additional"});
                    }
                }
            }else{
                res.json({message : "deck doesn't exist, please create a deck first"});
            }
        }else{
            res.json({message : "failed to add, must have deckname, username, and uuid"});
        }
    }catch(err){
        res.json({message: "An error has occured"});
        console.log(err);
    }
});
//get all the collections based on a userName
router.get('/get', async (req,res) => {
    try{
        if(req.query.userName){
            var collections = await Brew.find({"deck.user" : req.query.userName}).exec();
            var responseArr = [];
            collections.forEach(element => {
                responseArr.push(element.deck.deck);
            });
            res.json(responseArr);
        }else{
            res.json({message: "Must include username in query"});
        }
    }catch(err){
        console.log(err);
        res.json({message : err});
    }
});
//decrese the ammount of a card or remove a card
router.get('/remove', async (req,res) => {
    try{
        var cardAmmount = 1;
        if(req.query.deckName && req.query.userName && req.query.uuid){
            if (req.query.ammount){
                cardAmmount = req.query.ammount;
            }
            var deckExists = await Brew.exists({deck:{deck : req.query.deckName, user:req.query.userName}});
            if(deckExists){
                var CardExists = await Card.exists({uuid:req.query.uuid});
                if(CardExists){
                    var cardDeckstats = await Card.findOne({uuid:req.query.uuid},{brew:1, _id:0});
                    pass = true;
                    elementCount = -1;
                    cardDeckstats["brew"].forEach(element => {
                        if (element.user === req.query.userName && element.deck === req.query.deckName){
                            pass = false;
                            elementCount++;
                        }
                    });
                    if(pass){
                        res.json({message : "Cannot remove card, not in collection"});
                    }else{
                        currentAmmount = cardDeckstats.brew[elementCount]["ammount"];
                        cardAmmount = currentAmmount - cardAmmount;
                        if (cardAmmount <= 0){
                            cardDeckstats.brew.splice(elementCount,1);
                            var card = await Card.findOne({uuid:req.query.uuid},{brew:0});
                            card["brew"] = cardDeckstats["brew"];
                            await Card.updateOne({uuid:req.query.uuid},card);
                            res.json({message: "card already in collection/deck removing Card"});
                        }else{
                            cardDeckstats.brew[elementCount] = {deck : req.query.deckName, user : req.query.userName, ammount : cardAmmount};
                            var card = await Card.findOne({uuid:req.query.uuid},{brew:0});
                            card["brew"] = cardDeckstats["brew"];
                            await Card.updateOne({uuid:req.query.uuid},card);
                            res.json({message: "card already in collection/deck subtracting additional"});
                        }
                    }
                }
            }else{
                res.json({message : "deck doesn't exist, please create a deck first"});
            }
        }else{
            res.json({message : "failed to add, must have deckname, username, and uuid"});
        }
    }catch(err){
        res.json({message: "An error has occured"});
        console.log(err);
    }
});
//stats where you will get a list of deck stats WIP : 
//color distribution (like devotional information)
//spell types (ie creatures, artifacts, instants etc...)
router.get('/stats', async (req,res) => {
    try{
        if(req.query.userName && req.query.deckName){
            var cardCount = await Card.count({brew : {deck : req.query.deckName, user : req.query.userName}});
            var cards = await Card.find({brew : {deck : req.query.deckName, user : req.query.userName}});
            pips = {
                white : 0,
                blue : 0,
                black : 0,
                red : 0,
                green : 0,
                colourless : 0
            }
            manaValue = 0;
            cards.forEach(card => {
                cards.manaCost.forEach(letter => {
                    switch (letter){
                        case 'W':
                            pips.white++;
                            break;
                        case 'U': 
                            pips.blue++;
                            break;
                        case 'B':
                            pips.black++;
                            break;
                        case 'R':
                            pips.red++;
                            break;
                        case 'G':
                            pips.green++;
                            break;
                        case 'C':
                            pips.colourless++;
                            break;
                        default:
                            break;
                    }
                });
                manaValue = manaValue + card.manaValue;
            });
            if(cardCount != 0){
                avgManaValue = manaValue / cardCount;
            }
            res.json({'stats' : {
                'cardCount' : cardCount,
                'pips' : pips,
                'averageCost' : avgManaValue
            }});
        }else{
            res.json({message: "Must include userName in query and deckName"});
        }
    }catch(err){
        console.log(err);
        res.json({message : err});
    }
});
module.exports = router;