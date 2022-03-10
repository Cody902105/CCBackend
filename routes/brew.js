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
                var some = await Brew.create({
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
            var some = await Brew.deleteOne({deck : {deck : req.query.deckName, user : req.query.userName}});
            var removeOld = await Card.updateMany({deck : {deck : req.query.deckName, user : req.query.userName}},{$pull : {brew : {deck : req.query.deckName, user : req.query.userName}}});
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
                    cardDeckstats["brew"].forEach(element => {
                        if (element.user === req.query.userName && element.deck === req.query.deckName){
                            pass = false;
                        }
                    });
                    if(pass){
                        cardDeckstats.brew.push({deck : req.query.deckName, user : req.query.userName, ammount : cardAmmount});
                        var card = await Card.findOne({uuid:req.query.uuid},{deck:0});
                        card["brew"] = cardDeckstats["brew"];
                        var some = await Card.updateOne({uuid:req.query.uuid},card);
                        res.json({message : "Card added"});
                    }else{
                        res.json({message: "card already in collection"});
                    }
                }
            }else{
                res.json({message : "deck doesn't exist, please create a deck first"});
            }
        }else{
            res.json({message : "failed to add, must have deckname, username, and uuid"});
        }
    }catch(err){
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
module.exports = router;