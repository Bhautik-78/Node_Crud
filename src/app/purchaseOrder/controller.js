const mongoose = require("mongoose");
const User = require("../auth/model");
const axios = require('axios');
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
        if(UserDetail === null){
            return res.status(401).send({success: false, message: "Failed to authenticate token."})
        }
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

exports.purchaseOrder = async (req, res) => {
    try {
        const {code} = req.body;
        const object = {
            "id": "",
            "code": code || "",
            "ref": "",
            "status": "",
            "sort": ""
        };
        const response = await axios.post(`https://api.trevy.ai/hoservices/service/purchase/order/0/10`,object,{
            headers: {
                'app-key' : '2b845f01-789f-4d2f-a864-24075721408e',
                'user-code' : '1-1',
                'Content-Type': 'application/json'
            }
        });
        if (response.data.length) {
            res.status(200).send({message: "successFully", result: response.data})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.purchasePayment = async (req, res) => {
    try {
        const {status} = req.body;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(UserDetail === null){
            return res.status(401).send({success: false, message: "Failed to authenticate token."})
        }
        let object = {};
        if(UserDetail.vendor_Code){
            object = {
                "code": "",
                "fmDate": "",
                "toDate": "",
                "ref": UserDetail.vendor_Code || "",
                "status": status || "",
                "sort": ""
            };
        }else {
            return res.status(401).send({success: false, message: "cannot find vendor code"})
        }
        const response = await axios.post(`https://api.trevy.ai/hoservices/service/purchase/payment/0/10`,object,{
            headers: {
                'app-key' : '2b845f01-789f-4d2f-a864-24075721408e',
                'user-code' : '1-1',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            if(response.data.length){
                res.status(200).send({message: "successFully", result: response.data})
            }else {
                res.status(200).send({message: "successFully", result: response.data})
            }
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.purchaseReturn = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(UserDetail === null){
            return res.status(401).send({success: false, message: "Failed to authenticate token."})
        }
        let object = {};
        if(UserDetail.vendor_Code){
            object = {
                "code": "",
                "fmDate": "",
                "toDate": "",
                "ref": UserDetail.vendor_Code || "",
                "status": "",
                "sort": ""
            };
        }else {
            return res.status(401).send({success: false, message: "cannot find vendor code"})
        }
        const response = await axios.post(`https://api.trevy.ai/hoservices/service/purchase/returns/0/10`,object,{
            headers: {
                'app-key' : '2b845f01-789f-4d2f-a864-24075721408e',
                'user-code' : '1-1',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            if(response.data.length){
                res.status(200).send({message: "successFully", result: response.data})
            }else {
                res.status(200).send({message: "successFully", result: response.data})
            }
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
