const { query } = require('express');
const express = require('express');
const router = express.Router();
const Brew = require('../models/Brew');

//returns if the collection was created true / false
router.get('/create', async (req,res) => {
    try{
        deckName = '';
        formatName = '';
        leaderName = '';
        if(req.query.leader){
            leaderName = req.query.leader;
        }
        if(req.query.format){
            formatName = req.query.format;
        }
        if (req.query.DeckName && req.query.UserName){
            deckName = req.query.DeckName;
            var newDeck = await SetList.exists({deck :{ deck : deckName, user : UserName}});
            if(!newDeck){
                var some = Brew.create({
                    deck: {
                        deck : deckName,
                        user : UserName
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
        if(req.query.deckName && req.query.UserName){
            var some = await Brew.remove({deck : {deck : req.query.DeckName, user : UserName}});
            res.json({message: "Success, removed " + req.query.deckName + " for User " + req.query.UserName});
        }else{
            res.json({message: "Failed, need a deckname"});
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;