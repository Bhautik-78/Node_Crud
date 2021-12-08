const mongoose = require("mongoose");
const DesPatch = mongoose.model("desPatchNote");
const User = require("../auth/model")
require('dotenv').config();

exports.createApplication = async (req, res) => {
    try {
        const isCreated = await DesPatch.create(req.body);
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
        const {DCNumber = '', startDate = '', endDate = ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        let applicationData = []
        let query = {};
        if (DCNumber !== '') {
            query.DCNumber =  DCNumber
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.PODate = {$gte:startDate,$lte:endDate}
            }else {
                query.PODate = {$gte:startDate}
            }
        }
        applicationData = await DesPatch.find(query);
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
        const applicationData = await DesPatch.find({_id: id})
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
        const isUpdate = await DesPatch.updateOne({_id: req.params.id}, req.body);
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
        const isDeleted = await DesPatch.deleteOne({_id: req.params.id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

