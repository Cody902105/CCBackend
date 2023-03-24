const express = require('express');
const router = express.Router();

//get function returns the number of flip wins
router.get('/flip', async (req,res) => {
    try{ 
        var thumbs = 0;
        var repeat = 1;
        var intWins = 0;
        if (req.query.repeat){
            repeat = req.query.repeat;
        }  
        if (req.query.thumbs){
            thumbs = req.query.thumbs;
        }
        if (req.query.untill_loss){
            var intStop = 0;
            while (intStop == 0 && intWins <= 9999){
                var intWin = 0
                for (let i = 0; i < 2 ** thumbs; i++) {
                    if (Math.round(Math.random()) == 1){
                        intWin = 1;
                    }
                }
                if (intWin == 1){
                    intWins++;
                }else{
                    intStop = 1;
                }
            }
        }else{
            for (let x = 0; x < repeat ; x++){
                var intWin = 0
                for (let i = 0; i < 2 ** thumbs; i++) {
                    if (Math.round(Math.random()) == 1){
                        intWin = 1;
                    }
                }
                if (intWin == 1){
                    intWins++;
                }
            }
        }
        res.json({result : intWins});
    }catch(err){
        res.json({result : err});
    }
});
//get function returnes dice rolls
router.get('/roll', async (req,res) => {
    try{
        var die = 20; 
        var number = 1;
        var add = 1;
        if (req.query.dice){
            die = parseInt(req.query.dice);
        }
        if (req.query.number){
            number = req.query.number;
        }
        if (req.query.add){
            add = parseInt(req.query.add) + 1;
        }
        var rolls = [];
        for (i = 0; i < number; i++) {
            var roll = Math.floor(Math.random() * die) + add;
            rolls.push(roll);    
        }
        res.json({message: rolls});
    }catch(err){
        res.json({message : err});
    }
});
//get function to simulate frog dakmor deckstate
router.get('/frog', async (req,res) => {
            //possible dredge outcomes 
            //1: land and land          (Draw 2)
            //2: land and non-land      (Draw 1)
            //3: non-land and non-land  (Draw 0)
            //4: land and shuffeler     (Draw 1 - Shuffel)
            //5: non-land shuffeler     (Draw 0 - Shuffel)
            //6: Shuffel and Shuffel    (Draw 0 - Shuffel-Shuffel)
            // 6 only if we have more than one shuffel effect
            // the probablility of each effect changes as we go but we resolve shuffels and 
            // keep the draws untill we have draws eaqual to the number of cards in grave and library.
            
    try{
        var lands = 30;
        var graveLands = 0;
        var shuffelers = 1;
        var libraryCards = 99;
        var graveCards = 0;
        var actions = 0;
        var draws = 0;
        var timesShuffeled = 0
        var doShuff = 0
        if (req.query.lands){
            lands = parseInt(req.query.lands);
        }
        if (req.query.graveLands){
            graveLands = parseInt(req.query.graveLands);
        }
        if (req.query.shuffelers){
            shuffelers = parseInt(req.query.shuffelers);
        }
        if (req.query.libraryCards){
            libraryCards = parseInt(req.query.libraryCards);
        }
        if (req.query.graveCards){
            graveCards = parseInt(req.query.graveCards);
        }
        // have enough draws on the stack to draw the library
        while (draws < libraryCards + graveCards){
            actions++;
            if (doShuff == 1){
                lands = lands + graveLands;
                graveLands = 0;
                libraryCards = libraryCards + graveCards;
                graveCards = 0;
                doShuff = 0;
                timesShuffeled++;
            }
            for (i = 0; i < 2; i++) {
                dredge = Math.random();
                ChanceLand = (lands/libraryCards);
                ChanceNonL = ((libraryCards - lands)/libraryCards);
                ChanceShuf = ((shuffelers-doShuff)/libraryCards);
                if (dredge <= ChanceShuf){
                    libraryCards--;
                    graveCards++;
                    doShuff = 1;
                }else if((dredge > ChanceShuf) && (dredge <= (ChanceShuf+ChanceLand))){
                    draws++;
                    libraryCards--;
                    graveCards++;
                    lands--;
                    graveLands++;
                }else{
                    libraryCards--;
                    graveCards++;
                }
            }
        }
        res.json({actions: actions, Shuffels: timesShuffeled , extradraw: draws - (libraryCards + graveCards)});
    }catch(err){
        res.json({message : err});
    }
});
module.exports = router;