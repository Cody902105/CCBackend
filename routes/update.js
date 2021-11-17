const express = require('express');
const request = require('request');
const fs = require('fs');
const router = express.Router();
const Info = require('../models/Info');
const Card = require('../models/Card');
//Returns a true or false if there is a version discrepency between 'https://mtgjson.com/api/v5/Meta.json' and the meta version of our database
router.get('/', async (req,res) =>{
    try{
        request('https://mtgjson.com/api/v5/Meta.json', {json: true}, async (err, resR, body) => {
        if (err) { 
                return console.log(err); 
            }else{
                try{
                    //console.log(body.data.version);
                    Vers = body.data.version;
                    const updateAble = await Info.exists({version: Vers});
                    res.json({result: !updateAble});
                }catch(bigbaderr){
                    res.json({message: bigbaderr + " some"});
                }
            }
        });
    }catch(baderr){
        res.json({message: baderr});
    }
});
//Returns the number of updated and new cards. Updates the card database
router.get('/exc', async (req,res) =>{
    try{
        request('https://mtgjson.com/api/v5/AllPrintings.json', {json: true}, async (err, resR, body) => {
        if (err){
                return console.log(err); 
            }else{
                try{
                    console.log("Starting update check");
                    const needUpdate = await Info.exists({version: body.meta.version});
                    if (!needUpdate) {
                        var plistRemoved = await Card.deleteMany({setCode : "PLIST", owned : { $lt : 1 }});
                        console.log("Begining Update Process");
                        var updatedCards = 0;
                        var newCards = 0;
                        var newVersion = await Info.create(body.meta);
                        for  (const sets in body.data){
                            for (const card in body.data[sets]["cards"]){
                                var NewCard = await Card.exists({uuid : body.data[sets]["cards"][card].uuid});
                                if (!NewCard){
                                    var some = await Card.create(body.data[sets]["cards"][card]);
                                    newCards++;
                                }else{
                                    Card.updateOne({uuid : body.data[sets]["cards"][card].uuid},{$set:body.data[sets]["cards"][card]});
                                    updatedCards++;
                                }
                            }
                        }
                        const total = newCards+updatedCards;
                        console.log("Update Compleate. " + newCards +" New, " + updatedCards +" Updated, " + total + " Total");
                        res.json({
                            Updated: updatedCards,
                            New: newCards,
                            Total: total,
                            Version : newVersion
                        });
                    }else{
                        console.log("Update not nessisary");
                        res.json({message: "Already up to date"});
                    }
                }catch(bigbaderr){
                    res.json({message: bigbaderr + " some"});
                }
            }
        }); 
    }catch(err){
        res.json({message: err});
    }
});
router.get('/prices', async (req,res) =>{
    //this is where pricing will be
    try{
        const jsonPrices = await fs.readFileSync("./AllPrices.json");
        //console.log(jsonPrices);
        //console.log(jsonPrices.length);
        var step = 0;
        var count = 0;
        while (jsonPrices.indexOf('}}}}}', step) < (jsonPrices.length - 7)){
            var nextStep = jsonPrices.indexOf('}}}}}', step) + 6;
            console.log(jsonPrices.indexOf('}}}}}', step));
            var ThisCardbuf = jsonPrices.slice(step,nextStep);
            var ThisCard = ThisCardbuf.toString();
            //console.log('\n\n' + ThisCard);
            count++;
            step = nextStep;
        } 
        console.log(count);
        res.json({message: 'wedidit'});
    }catch(bigbaderr){
        console.log('Prices Failed to update');
        res.json({message: bigbaderr});
    }
});
module.exports = router;