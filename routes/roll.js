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
module.exports = router;