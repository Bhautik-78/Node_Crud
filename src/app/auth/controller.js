const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const User = mongoose.model("userRole");
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');

exports.loginAdmin = async (req, res) => {
    try {
        const {email, passWord} = req.body;
        const userDetail = await User.findOne({email});
        const isMatch = bcrypt.compareSync(passWord, userDetail.passWord);
        if(isMatch){
            let token = jwt.sign({ email: email}, config.secret, {
                expiresIn: 18000
            });
            await User.updateOne({email}, {accessToken: token})
            res.status(200).send({ auth: true, token: token, detail: userDetail });
        }else {
            res.status(500).send({message: "UserName OR Password is not match"});
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.CreateUser = async (req,res) => {
    try {
        req.body.passWord = bcrypt.hashSync(req.body.passWord, 8);
        // req.body.isAdmin = false;
        const isCreated = await User.create(req.body);
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.editUser = async (req, res) => {
    try {
        const { id } = req.params;
        req.body.passWord = bcrypt.hashSync(req.body.passWord, 8);
        const isUpdate = await User.updateOne({_id: id}, req.body);
        if (isUpdate) {
            res.status(200).send({message: "successFully updated PassWord"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.forgetPassword = async (req, res) => {
    try{
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bhautik.bvminfotech@gmail.com',
                pass: 'bvm@12345'
            }
        });

        const userDetails = await User.findOne({email: req.body.email})
        console.log("userDetails",userDetails)
        if (userDetails && userDetails._id) {
            let mailDetails = {
                from: 'bhautik.bvminfotech@gmail.com',
                to: req.body.email,
                subject: "Your Forgotton Password", // Subject line
                text: "Your Forgotton Password", // plain text body
                html: `<b>Hello you forgot Your password so below link is for reseting password click below.</b> <link>https://emart-beta.vercel.app/password-reset/${userDetails._id}</link>` // html body
            };
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs',err);
                    res.status(400).send({message: "Error Occurs"})
                } else {
                    console.log('Email sent successfully');
                    res.status(200).send({
                        message: "Email sent successfully"
                    });
                }
            });
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getALlUser = async (req,res) =>{
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(!UserDetail || !UserDetail.isAdmin) res.status(400).send("Invalid User Request");

        const obj = {isAdmin : false};
        req.params.id ? obj._id = mongoose.Types.ObjectId(req.params.id) : null;
        const userArray = await User.find(obj);

        res.status(200).send({message: "successFull",userList:userArray})
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.ChangeActiveStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const UserDetail = await User.findOne({_id: id});
        if(UserDetail._id){
            const isUpdate = await User.updateOne({_id: id}, {isActive : !UserDetail.isActive});
            if (isUpdate) {
                res.status(200).send({message: "successFully Changed Status"})
            } else {
                res.status(400).send({message: "something Went Wrong"})
            }
        }else {
            res.status(400).send({message: "User Not Found"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
