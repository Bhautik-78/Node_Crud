const mongoose = require("mongoose");
const debitMemoSchema = mongoose.model("debitMemo");
const User = require("../auth/model")

exports.getAllUserDebitMemo = async (req, res) => {
    try {
        const {userID = ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        let userDebitMemoArray = []
        let query = {};
        if(userID !== ''){
            query.userID = userID
        }
        userDebitMemoArray = await debitMemoSchema.find({});
        if(!UserDetail.isAdmin){
            userDebitMemoArray = userDebitMemoArray.filter(item => item.userID == UserDetail._id)
        }
        if(userDebitMemoArray.length){
            res.status(200).send(userDebitMemoArray)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}

exports.AddUserDebitMemo = async (req, res) => {
    try {
        const isCreated = await debitMemoSchema.create(req.body);
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}

exports.ChangeUserDebitMemo = async (req, res) => {
    try {
        const {id} = req.params;
        const isUpdate = await debitMemoSchema.updateOne({_id: id}, req.body);
        if (isUpdate) {
            res.status(200).send({message: "successFully updated DebitMemo data"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}

exports.removeUserDebitMemo = async (req, res) => {
    try {
        let {id} = req.params;
        const isDeleted = await debitMemoSchema.deleteOne({_id:id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
}
