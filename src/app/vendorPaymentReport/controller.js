const mongoose = require("mongoose");
const PaymentReport = mongoose.model("vendorPaymentReport");
const User = require("../auth/model");
const moment = require("moment");
require('dotenv').config();

exports.createPaymentReport = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(UserDetail){
            req.body.paymentDate = moment(new Date()).format('YYYY-MM-DD');
            req.body.userId = UserDetail._id;
            const isCreated = await PaymentReport.create(req.body);
            if(isCreated){
                res.status(200).send({message: "successFully created"})
            }else {
                res.status(400).send({message: "something Went Wrong"})
            }
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
