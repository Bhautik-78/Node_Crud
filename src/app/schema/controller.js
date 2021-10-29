const mongoose = require("mongoose");
const Schema = mongoose.model("schema");
require('dotenv').config();

exports.getApplication = async (req, res) => {
    try {
        console.log("req.query",req.query)
        const {schemaNumber, date} = req.query;
        let query = {};
        if (req.body) {
            query = {
                schemaNumber : schemaNumber,
                date : date
            }
        }
        const applicationData = await Schema.find(query)
        res.status(200).send(applicationData)
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.createApplication = async (req, res) => {
    try {
        const isCreated = await Schema.create(req.body)
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
