const mongoose = require("mongoose");
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
        const {PONumber = '', startDate = '', endDate = ''} = req.query;
        let query = {};
        if (PONumber !== '') {
            query.PONumber =  PONumber
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.Date = {$gte:startDate,$lte:endDate}
            }else {
                query.Date = {$gte:startDate}
            }
        }
        const applicationData = await PurchaseOrder.find(query);
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(201).send({message: "data does not exist"})
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

