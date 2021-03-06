const mongoose = require("mongoose");
const Schema = mongoose.model("schema");
const User = require("../auth/model")
require('dotenv').config();

exports.getApplication = async (req, res) => {
    try {
        const {schemaNumber = "", startDate = "", endDate = "", userID= ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        if(UserDetail === null){
            return res.status(401).send({success: false, message: "Failed to authenticate token."})
        }
        let applicationData = []
        let query = {};
        if(schemaNumber !== ''){
            query.schemaNumber = schemaNumber
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.date = {$gte:startDate,$lte:endDate}
            }else {
                query.date = {$gte:startDate}
            }
        }
        if(userID !== ''){
            query.userID = userID
        }
        applicationData = await Schema.find(query)
        if(!UserDetail.isAdmin){
            applicationData = applicationData.filter(item => item.userID == UserDetail._id)
        }
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplicationForID = async (req, res) => {
    try {
        const { id } = req.params;
        const applicationData = await Schema.find({_id: id})
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplicationForEanCode = async (req,res) => {
    try {
        const { eancode } = req.params;
        const applicationData = await Schema.find({EANCode: Number(eancode)})
        if(applicationData.length){
            const newapplicationData = applicationData.map(data=> {
                return{
                    _id : data._id,
                    userID : data.userID,
                    schemaName : data.schemaName,
                    EANCode : data.EANCode,
                }
            })
            res.status(200).send(newapplicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }

    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}


exports.createApplication = async (req, res) => {
    try {
        const {schemaName, EANCode} = req.body;
        const applicationData = await Schema.find({"schemaName": { $regex : new RegExp("^" + schemaName , "i") }, EANCode: EANCode});
        if(applicationData.length){
            return res.status(201).send({message: `${schemaName} is already exist`})
        }
        const isCreated = await Schema.create(req.body);
        if(isCreated){
            res.status(200).send({message: "successFully created"})
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.editApplication = async (req, res) => {
    try {
        const isUpdate = await Schema.updateOne( { _id: req.params.id } , req.body );
        if(isUpdate){
            res.status(200).send({message: "successFully updated"})
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const isDeleted = await Schema.deleteOne( {_id : req.params.id});
        if(isDeleted){
            res.status(200).send({message: "successFully deleted"})
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getMaxSchemaNumber = async (req, res) => {
    try {
        const relate = await Schema.aggregate([
            {
                $group: {
                    _id: null,
                    maxQuantity: {$max: "$schemaNumber"}
                }
            }
        ]);
        let result = relate[0].maxQuantity ? (relate[0].maxQuantity + 1) : 1001;
        if(relate){
            res.status(200).send({maxSchemaNumber : result,message: "successFully fetched maxSchemaNumber"})
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
