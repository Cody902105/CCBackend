const express = require('express');
const request = require('request');
const fs = require('fs');
const https = require('https');
const router = express.Router();
const Info = require('../models/Info');
const Card = require('../models/Card');
const SetList = require('../models/SetList');
//I work in pounds so this is the relative conversion rate
const EURO_RATE = 0.85;
const USD_RATE = 0.75;
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
        request('https://mtgjson.com/api/v5/SetList.json', {json: true}, async (err, resR, body) => {
            if (err){
                return console.log(err);
            }else{
                console.log("Updating Sets");
                var newSets = 0;
                var updatedSets = 0;
                for (const Sets in body.data){
                    var newSet = await SetList.exists({code : body.data[Sets]["code"]});
                    if (!newSet){
                        await SetList.create(body.data[Sets]);
                        newSets++;
                    }else{
                        await SetList.updateOne({code : body.data[Sets]["code"]},{$set:body.data[Sets]});
                        updatedSets++;
                    }
                }
                console.log("New Sets: " + newSets + " Updated Sets: " + updatedSets);
            }
        });
        request('https://mtgjson.com/api/v5/AllPrintings.json', {json: true}, async (err, resR, body) => {
        if (err){
                return console.log(err); 
            }else{
                try{
                    console.log("Starting update check");
                    const needUpdate = await Info.exists({version: body.meta.version});
                    if (!needUpdate) {
                        console.log("Begining Update Process");
                        var currentCardList = [];
                        var updatedCards = 0;
                        var newCards = 0;
                        var newVersion = await Info.create(body.meta);
                        for  (const sets in body.data){
                            for (const card in body.data[sets]["cards"]){
                                var NewCard = await Card.exists({uuid : body.data[sets]["cards"][card].uuid});
                                if (!NewCard){
                                    await Card.create(body.data[sets]["cards"][card]);
                                    newCards++;
                                }else{
                                    await Card.updateOne({uuid : body.data[sets]["cards"][card].uuid},{$set:body.data[sets]["cards"][card]});
                                    updatedCards++;
                                }
                                currentCardList.push(body.data[sets]["cards"][card].uuid);
                            }
                        }
                        const total = newCards+updatedCards;
                        console.log("Update Compleate. " + newCards +" New, " + updatedCards +" Updated, " + total + " Total");
                        console.log("Deleting Redundant Cards");
                        var delCards = await Card.find({uuid : {'$nin' : currentCardList}},{_id : 0, uuid : 1});
                        for (delIndex in delCards){
                            await Card.deleteOne(delCards[delIndex]);
                        }
                        console.log(delCards.length + " Redundant Cards removed");
                        console.log("Update Compleate");
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
        var failedPrice = 0;
        var successPrice = 0;
        theSets = await SetList.find({});
        for (const Sets in theSets){
            var Cards = await Card.find({setCode : theSets[Sets]["code"]});
            for (const card in Cards){
                setTimeout(function () {
                    if (Cards[card] != undefined) {
                        if (Cards[card]["identifiers"]["scryfallId"] != null) {
                            request('https://api.scryfall.com/cards/' + Cards[card]["identifiers"]["scryfallId"], { json: true , Connection: "keep-alive"}, (scryErr, scryResR, scryBody) => {
                                if (scryErr) {
                                    //console.log(scryErr);
                                } else {
                                    if (scryBody != undefined && Cards[card] != undefined) {
                                        if (scryBody["prices"] != undefined){
                                            if (scryBody["prices"]["eur"] != null) {
                                                Card.updateOne({ uuid: Cards[card]["uuid"] }, { price: scryBody["prices"]["eur"] });
                                                successPrice++;
                                            } else if (scryBody["prices"]["eur_foil"] != null) {
                                                Card.updateOne({ uuid: Cards[card]["uuid"] }, { price: scryBody["prices"]["eur_foil"] });
                                                successPrice++;
                                            } else if (scryBody["prices"]["usd"] != null) {
                                                Card.updateOne({ uuid: Cards[card]["uuid"] }, { price: scryBody["prices"]["usd"]  * 1.02});
                                                successPrice++;
                                            } else if (scryBody["prices"]["usd_foil"] != null) {
                                                Card.updateOne({ uuid: Cards[card]["uuid"] }, { price: scryBody["prices"]["usd_foil"] * 1.02});
                                                successPrice++;
                                            } else if (scryBody["prices"]["tix"] != null) {
                                                Card.updateOne({ uuid: Cards[card]["uuid"] }, { price: scryBody["prices"]["tix"] });
                                                successPrice++;
                                            } else {
                                                failedPrice++;
                                            }
                                        } else {
                                            failedPrice++;
                                        }
                                    } else {
                                        failedPrice++;
                                    }
                                }
                            });
                        }
                    }
                }, 50);
            }
        }
        console.log("Prices Updated " + successPrice + " found prices, " + failedPrice + " failed prices");
        res.json({message: "Prices Updated"})
    }catch(bigbaderr){
        console.log('Prices Failed to update: ' + bigbaderr);
        res.json({message: bigbaderr});
    }
});

module.exports = router;