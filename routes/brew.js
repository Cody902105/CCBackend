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
        if (req.query.DeckName){
            deckName = req.query.DeckName;
            var newDeck = await SetList.exists({deck : deckName});
            if(!newDeck){
                var some = Brew.create({
                    deck: deckName,
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
//updates the metadata of the collection
router.get('/add', async (req,res) => {
    try{
        pass = true;
        additionObject = {};
        if(req.query.uuid){
            additionObject = {uuid: req.query.uuid};
        }else{
            pass = false;
        }
        if(req.query.name){
            additionObject = additionObject ,{name: req.query.name};
        }else{
            pass = false;
        }
        if(req.query.ammount){
            additionObject = additionObject ,{ammount: req.query.ammount};
        }else{
            additionObject = additionObject ,{ammount: 1};
        }
        if(req.query.set){
            additionObject = additionObject ,{set: req.query.set};
        }
        if(req.query.finishes){
            additionObject = additionObject ,{finishes: req.query.finishes};
        }
        if(req.query.imgURLFront && req.query.imgURLBack){
            additionObject = additionObject ,{imgUrl: { front : req.query.imgURLFront, back : req.query.imgURLBack}};
        }else if(req.query.imgURLFront){
            additionObject = additionObject ,{imgUrl: { front : req.query.imgURLFront}};
        }
        if(req.query.tags){
            additionObject = additionObject ,{tags: req.query.tags};
        }
        if(req.query.DeckName && pass){
            var newDeck = await SetList.exists({deck : req.query.DeckName});
            if(!newDeck){
                additionObject = additionObject ,{deck: req.query.DeckName};
                res.json({message: "Success, " + req.query.name + " added to " + req.query.DeckName});
            }else{
                res.json({message: "Failed, deck does not exist"});
            }
        }else{
            res.json({message: "Failed, did not input correct params"});
        }
    }catch(err){
        console.log(err);
    }
});
//removes a card from a deck
router.get('/remove', async (req,res) => {
    try{
        if(req.query.deckName){
            if(req.query.uuid){
                if(req.query.ammount){
                    var found = await Brew.findOne({uuid: req.query.uuid, deck: req.query.DeckName});
                    numberOf = found.ammount;
                    if(numberOf <= req.query.ammount){
                        var some = await Brew.remove({uuid:req.query.uuid, deck: req.query.deckName});
                    }else{
                        numberToUpdate = numberOf - req.query.ammount;
                        var some = await Brew.updateOne({uuid:req.query.uuid, deck: req.query.deckName},{ammount: numberToUpdate});
                    }
                }else{
                    var some = await Brew.remove({uuid:req.query.uuid, deck: req.query.deckName});
                }
            }
            if(req.query.name){
                res.json({message: "Success, " + req.query.name + " removed from " + req.query.deckName});
            }else{
                res.json({message: "Success, card removed from " + req.query.deckName});
            }
        }else{
            res.json({message: "Failed, need a deckname"});
        }
    }catch(err){
        console.log(err);
    }
});
//removes a deck
router.get('/removeDeck', async (req,res) => {
    try{
        if(req.query.deckName){
            var some = await Brew.remove({deck:req.query.DeckName});
            res.json({message: "Success, removed " + req.query.deckName});
        }else{
            res.json({message: "Failed, need a deckname"});
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;