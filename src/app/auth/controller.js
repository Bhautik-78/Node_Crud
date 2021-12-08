const mongoose = require("mongoose");
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
