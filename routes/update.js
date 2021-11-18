const express = require('express');
const request = require('request');
const fs = require('fs');
const router = express.Router();
const Info = require('../models/Info');
const Card = require('../models/Card');
//I work in pounds so this is the relative conversion rate
const EURO_RATE = 0.84;
const USD_RATE = 0.74;
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
                                    var some = await Card.updateOne({uuid : body.data[sets]["cards"][card].uuid},{$set:body.data[sets]["cards"][card]});
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
        console.log('failed to update: '+ err)
        res.json({message: err});
    }
});
//Returns the number of updated and and abandoned card prices. Updates the card database
router.get('/prices', async (req,res) =>{
    //this is where pricing will be
    console.log("Begining pricing update");
    try{
        const jsonPrices = await fs.readFileSync("./AllPrices.json");
        var step = 71;
        var count = 0;
        var totalCount = 0;
        while (jsonPrices.indexOf('}}}}}', step) < (jsonPrices.length - 7)){
            var nextStep = jsonPrices.indexOf('}}}}}', step) + 6;
            var ThisCardbuf = jsonPrices.slice(step,nextStep-1);
            var ThisCardstr = ThisCardbuf.toString();
            var ThisCardJson = JSON.parse("{"+ThisCardstr+"}");
            var cardUUID = Object.keys(ThisCardJson)[0];
            var cardExists = await Card.exists({uuid: cardUUID});
            totalCount++;
            if (cardExists){
                if(ThisCardJson[cardUUID]["paper"] !== undefined){
                    if(ThisCardJson[cardUUID]["paper"]["cardkingdom"] !== undefined){
                        var cardPrice = getPrice(ThisCardJson[cardUUID]["paper"]["cardkingdom"]);
                        //console.log(cardPrice);
                        var some = await Card.updateOne({uuid : cardUUID},{price : cardPrice});
                        count++;
                    }else if(ThisCardJson[cardUUID]["paper"]["cardmarket"] !== undefined){
                        var cardPrice = getPrice(ThisCardJson[cardUUID]["paper"]["cardmarket"]);
                        //console.log(cardPrice);
                        var some = await Card.updateOne({uuid : cardUUID},{price : cardPrice});
                        count++;
                    }
                }else if(ThisCardJson[cardUUID]["mtgo"]["cardhoarder"] !== undefined){
                    var cardPrice = getPrice(ThisCardJson[cardUUID]["mtgo"]["cardhoarder"]);
                    //console.log(cardPrice);
                    var some = await Card.updateOne({uuid : cardUUID},{price : cardPrice});
                    count++;
                }
            }
            step = nextStep;
        } 
        console.log('Card prices Updated: ' + count + ', Total Cards: ' + totalCount);
        res.json({message: ' Cards prices updated ' + count});
    }catch(bigbaderr){
        console.log('Prices Failed to update: ' + bigbaderr);
        res.json({message: bigbaderr});
    }
});
function getPrice(data){
    if (data["retail"] !== undefined) {
        if (data["retail"]["normal"] !== undefined){
            var avgInt = 0;
            var avgAddition = 0;
            for (dates in data["retail"]["normal"]){
                avgAddition += data["retail"]["normal"][dates];
                avgInt++;
            }
            if(avgInt != 0){
                var cardPrice = avgAddition / avgInt;
                if(data["currency"] !== undefined){
                    if(data["currency"] === 'USD') {
                        cardPrice = (cardPrice * USD_RATE).toFixed(2);
                        if (cardPrice < 0.01){
                            cardPrice = 0.01;
                        }
                        return cardPrice;
                    }else{
                        cardPrice = (cardPrice * EURO_RATE).toFixed(2);
                        if (cardPrice < 0.01){
                            cardPrice = 0.01;
                        }
                        return cardPrice;
                    }
                }
            }
            return 0;
        }
        else if(data["retail"]["foil"] !== undefined){
            var avgInt = 0;
            var avgAddition = 0;
            for (dates in data["retail"]["foil"]){
                avgAddition += data["retail"]["foil"][dates];
                avgInt++;
            }
            if(avgInt != 0){
                var cardPrice = avgAddition / avgInt;
                if(data["currency"] !== undefined){
                    if(data["currency"] === 'USD') {
                        cardPrice = (cardPrice * USD_RATE).toFixed(2);
                        if (cardPrice < 0.01){
                            cardPrice = 0.01;
                        }
                        return cardPrice;
                    }else{
                        cardPrice = (cardPrice * EURO_RATE).toFixed(2);
                        if (cardPrice < 0.01){
                            cardPrice = 0.01;
                        }
                        return cardPrice;
                    }
                }
            }
            return 0;
        }
    }else{
        return 0;
    }
} 
module.exports = router;