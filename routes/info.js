const express = require('express');
const router = express.Router();
const Info = require('../models/Info');
//Returns the version information of the card database
router.get('/', async (req,res) =>{
    try{
        const infos = await Info.find();
        res.json(infos);
    }catch(err){
        res.json({message:err});
    }
});
//Posts the new card version, shouldn't typicaly be used
router.post('/', async (req,res) => {
    const postInfo = new Info({
        date: req.body.date,
        version: req.body.version
    });
    try{
        const saveInfo = await postInfo.save();
        res.json(saveInfo);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;