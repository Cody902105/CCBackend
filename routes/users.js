const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcrypt');

router.get('/', async (req,res) =>{
    try{
        
    }catch(err){
        res.json({message:err});
    }
});

router.post('/', async (req,res) =>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        const userCheck = await Users.exists({userName : userName});
        const emailCheck =  await Users.exists({email : email});
        if (!userCheck){
            if(!emailCheck && userName != null && password != null && email != null ){
                const hashPass = await bcrypt.hash(password,10);
                await Users.create({
                    "userName": userName,
                    "email": email,
                    "password": hashPass
                });
                res.status(200).json({message :"user created"});
            }else{
                res.status(201).json({message: "email already exists"});
            }
        }else{
            res.status(201).json({message: "username already exists"});
        }
    }catch(err){
        res.status(500).json({message:err});
    }
});

router.post('/login', async (req,res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const userCheck = await Users.exists({userName: userName});
    try{
        if (userCheck){
            User = await Users.findOne({userName:userName})
            const loginCheck = await bcrypt.compare(password, User.password);
            if (loginCheck){
                res.status(200).json({message: "success"});
            }else{
                res.status(201).json({message: "bad password"});
            }
        }else{
            res.status(201).json({message:"bad username"});
        }
    }catch(err){
        res.status(500).json({message:err});
    }
});
module.exports = router;