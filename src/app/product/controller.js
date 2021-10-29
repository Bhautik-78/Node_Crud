const mongoose = require("mongoose");
const Product = mongoose.model("product");
require('dotenv').config();

exports.getApplication = async (req, res) => {
    try {
        const {productName = '', EANCode = '', SKUCode = ''} = req.query;
        let query = {};
        if ((productName !== '') || (EANCode !== '') ||  (SKUCode !== '')) {
            query = {
                productName : productName,
                EANCode : EANCode,
                SKUCode : SKUCode
            }
        }
        const applicationData = await Product.find(query);
        res.status(200).send(applicationData)
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.createApplication = async (req, res) => {
    try {
        const isCreated = await Product.create(req.body)
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
        const isUpdate = await Product.updateOne( { _id: req.params.id } , req.body );
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
        const isDeleted = await Product.deleteOne( {_id : req.params.id});
        console.log("isDeleted",isDeleted)
        if(isDeleted){
            res.status(200).send({message: "successFully deleted"})
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
