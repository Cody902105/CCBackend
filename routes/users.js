const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcrypt');

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
router.post('/changepassword', async (req,res) =>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const userCheck = await Users.exists({userName : userName});
        const emailCheck =  await Users.exists({email : email});
        if (userCheck && emailCheck){
            var User = await Users.findOne({userName : userName, email : email})
            const passCheck = await bcrypt.compare(oldPassword,User.password);
            if(passCheck){
                const hashPass = await bcrypt.hash(newPassword,10);
                User.password = hashPass;
                await Users.updateOne({userName : userName, email : email},User);
                res.status(200).json({message:"Password Changed"});
            }else{
                res.status(201).json({message:"access denied"});
            }
        }else{
            res.status(201).json({message:"User doesn't exist"});
        }
    }catch(err){
        res.status(500).json({message:err});
    }
});
router.post('/resetpassword', async (req,res) =>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        const userCheck = await Users.exists({userName : userName});
        const emailCheck =  await Users.exists({email : email});
        if (userCheck && emailCheck){
            var User = await Users.findOne({userName : userName, email : email})
            const hashPass = await bcrypt.hash(newPassword,10);
            User.password = hashPass;
            await Users.updateOne({userName : userName, email : email},User);
            res.status(200).json({message:"Password Changed"});
        }else{
            res.status(201).json({message:"User doesn't exist"});
        }
    }catch(err){
        res.status(500).json({message:err});
    }
});
module.exports = router;