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
            while (intStop == 0){
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

module.exports = router;