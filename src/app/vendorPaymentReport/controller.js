const mongoose = require("mongoose");
const PaymentReport = mongoose.model("vendorPaymentReport");
const User = require("../auth/model");
const moment = require("moment");
require('dotenv').config();

exports.createPaymentReport = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(UserDetail){
            req.body.paymentDate = moment(new Date()).format('YYYY-MM-DD');
            req.body.userId = UserDetail._id;
            const isCreated = await PaymentReport.create(req.body);
            if(isCreated){
                res.status(200).send({message: "successFully created"})
            }else {
                res.status(400).send({message: "something Went Wrong"})
            }
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getPaymentList = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        let paymentList = []
        let query = {};
        paymentList = await PaymentReport.find(query).populate({ path: 'userId', select: 'email mobileNumber firstName middleName lastName GST IFSCCode accountNumber panNo vendorType' });
        if(!UserDetail.isAdmin){
            paymentList = paymentList.filter(item => item.userId._id.toString() === UserDetail._id.toString())
        }
        if(paymentList.length){
            res.status(200).send(paymentList)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
