const mongoose = require("mongoose");
const creditMemoSchema = mongoose.model("creditMemo");
const User = require("../auth/model")

exports.getAllUserCreditMemo = async (req, res) => {
    try {
        const {userID = ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        if(UserDetail === null){
            return res.status(401).send({success: false, message: "Failed to authenticate token."})
        }
        let userCreditMemoArray = []
        let query = {};
        if(userID !== ''){
            query.userID = userID
        }
        userCreditMemoArray = await creditMemoSchema.find(query);
        if(!UserDetail.isAdmin){
            userCreditMemoArray = userCreditMemoArray.filter(item => item.userID == UserDetail._id)
        }
        if(userCreditMemoArray.length){
            res.status(200).send(userCreditMemoArray)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getUserCreditMemoForID = async (req,res) => {
    try {
        const { id } = req.params;
        const applicationData = await creditMemoSchema.find({_id: id})
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.AddUserCreditMemo = async (req, res) => {
    try {
        const isCreated = await creditMemoSchema.create(req.body);
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}

exports.ChangeUserCreditMemo = async (req, res) => {
    try {
        const {id} = req.params;
        const isUpdate = await creditMemoSchema.updateOne({_id: id}, req.body);
        if (isUpdate) {
            res.status(200).send({message: "successFully updated CreditMemo data"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}

exports.removeUserCreditMemo = async (req, res) => {
    try {
        let {id} = req.params;
        const isDeleted = await creditMemoSchema.deleteOne({_id:id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}
