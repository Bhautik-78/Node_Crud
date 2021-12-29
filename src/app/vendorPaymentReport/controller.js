const mongoose = require("mongoose");
const PaymentReport = mongoose.model("vendorPaymentReport");
const User = require("../auth/model");
const Invoice = require("../invoice/model");
const moment = require("moment");
require('dotenv').config();

exports.createPaymentReport = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken: authorization});
        if (UserDetail) {
            req.body.paymentDate = moment(new Date()).format('YYYY-MM-DD');
            req.body.userId = UserDetail._id;
            const isCreated = await PaymentReport.create(req.body);
            if (isCreated) {
                res.status(200).send({message: "successFully created"})
            } else {
                res.status(400).send({message: "something Went Wrong"})
            }
        } else {
            res.status(400).send({message: "something went wrong"})
        }
    } catch (err) {
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

exports.getOutStandingReport = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        let userList = [];
        if(UserDetail.isAdmin){
            userList = await User.find({isAdmin : false});
        }else {
            userList.push(UserDetail)
        }
        const OutStandingReport = [];
        for (const user of userList) {
            let invoiceValue = 0;
            let paymentValue = 0;
            const invoiceList = await Invoice.find({userID: user._id});
            if (invoiceList.length) {
                invoiceValue = invoiceList.reduce(function (sum, current) {
                    return sum + current.invoiceValue;
                }, 0);
            }
            const paymentList = await PaymentReport.find({userId: user._id});
            if (paymentList.length) {
                paymentValue = paymentList.reduce(function (sum, current) {
                    return sum + current.amount;
                }, 0);
            }
            const TotalBalance = invoiceValue - paymentValue;
            const data = {
                vendorCode: user._id,
                vendorName: user.firstName + " " + user.middleName + " " + user.lastName,
                invoiceTotal: invoiceValue,
                paymentTotal: paymentValue,
                balanceTotal: TotalBalance
            };
            OutStandingReport.push(data)
        }
        if(OutStandingReport.length){
            res.status(200).send(OutStandingReport)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
