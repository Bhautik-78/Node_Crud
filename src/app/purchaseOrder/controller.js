const mongoose = require("mongoose");
const User = require("../auth/model");
const PurchaseOrder = mongoose.model("purchaseOrder");
require('dotenv').config();

exports.createApplication = async (req, res) => {
    try {
        const isCreated = await PurchaseOrder.create(req.body);
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplication = async (req, res) => {
    try {
        const {PONumber = '', startDate = '', endDate = '',userID = ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        let applicationData = []
        let query = {};
        if (PONumber !== '') {
            query.PONumber =  PONumber
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.PODate = {$gte:startDate,$lte:endDate}
            }else {
                query.PODate = {$gte:startDate}
            }
        }
        if(userID !== ''){
            query.userID = userID
        }
        applicationData = await PurchaseOrder.find(query);
        if(!UserDetail.isAdmin){
            applicationData = applicationData.filter(item => item.userID == UserDetail._id)
        }
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplicationForID = async (req, res) => {
    try {
        const { id } = req.params;
        const applicationData = await PurchaseOrder.find({_id: id})
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.editApplication = async (req, res) => {
    try {
        const isUpdate = await PurchaseOrder.updateOne({_id: req.params.id}, req.body);
        if (isUpdate) {
            res.status(200).send({message: "successFully updated"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const isDeleted = await PurchaseOrder.deleteOne({_id: req.params.id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

