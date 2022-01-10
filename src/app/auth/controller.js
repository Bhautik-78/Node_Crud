const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const axios = require('axios');
const moment = require('moment');
const User = mongoose.model("userRole");
const DesPatch = require("../despatchNote/model");
const Invoice = require("../invoice/model");
const Product = require("../product/model");
const PurchaseOrder = require("../purchaseOrder/model");
const Schema = require("../schema/model");
const creditMemoSchema = require("../creditmemo/model");
const debitMemoSchema = require("../debitmemo/model");
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');

const path = require('path');
const fs = require('fs');

exports.loginAdmin = async (req, res) => {
    try {
        const {email, passWord} = req.body;
        const userDetail = await User.findOne({email});
        const isMatch = bcrypt.compareSync(passWord, userDetail.passWord);
        if(isMatch){
            let token = jwt.sign({ email: email}, config.secret, {
                expiresIn: 18000
            });
            await User.updateOne({email}, {accessToken: token})
            res.status(200).send({ auth: true, token: token, detail: userDetail });
        }else {
            res.status(201).send({message: "UserName OR Password is not match"});
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.CreateUser = async (req, res) => {
    try {
        let file = req.file;
        if(file){
            var extname = path.extname(file.originalname);
            let filename = `/uploads/userimage/${file.originalname}`;
            if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.PNG') {
                req.body.userImg = filename;
            }else {
                req.body.userImg = "";
            }
        }
        const mobile = await User.find({ mobileNumber : req.body.mobileNumber });
        const email = await User.find({ email : req.body.email });
        if (mobile.length && email.length) {
            return res.status(201).send({
                message: {
                    email: "email is Already Exist",
                    mobileNumber: "Mobile Number is Already Exist"
                }
            })
        }
        if (mobile.length) {
            return res.status(201).send({message: {
                    mobileNumber: "Mobile Number is Already Exist"
                }})
        } else {
            req.body.mobileNumber = Number(req.body.mobileNumber);
        }
        if (email.length) {
            return res.status(201).send({message: {
                    email: "email is Already Exist"
                }})
        }
        req.body.passWord = bcrypt.hashSync(req.body.passWord, 8);
        const isCreated = await User.create(req.body);
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.editUser = async (req, res) => {
    try {
        let file = req.file;
        const {id} = req.params;
        const isUser = await User.findOne({_id: id});
        if (!isUser) return res.status(400).send({message: "User is not found"});
        if (file) {
            if (isUser.userImg) {
                let oldImageDelete = path.join(process.cwd(), isUser.userImg);
                fs.unlinkSync(oldImageDelete);
            }
            var extname = file && path.extname(file.originalname);
            let filename = `/uploads/userimage/${file.originalname}`;
            if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.PNG') {
                req.body.userImg = filename;
            }
        }
        if (req.body.passWord) {
            req.body.passWord = bcrypt.hashSync(req.body.passWord, 8);
        }
        const isUpdate = await User.updateOne({_id: id}, req.body);
        if (isUpdate) {
            res.status(200).send({message: "successFully updated data"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.forgetPassword = async (req, res) => {
    try{
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bhautik.bvminfotech@gmail.com',
                pass: 'bvm@12345'
            }
        });

        const userDetails = await User.findOne({email: req.body.email})
        console.log("userDetails",userDetails)
        if (userDetails && userDetails._id) {
            let mailDetails = {
                from: 'bhautik.bvminfotech@gmail.com',
                to: req.body.email,
                subject: "Your Forgotton Password", // Subject line
                text: "Your Forgotton Password", // plain text body
                html: `<b>Hello you forgot Your password so below link is for reseting password click below.</b> <link>https://emart-beta.vercel.app/password-reset/${userDetails._id}</link>` // html body
            };
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs',err);
                    res.status(400).send({message: "Error Occurs"})
                } else {
                    console.log('Email sent successfully');
                    res.status(200).send({
                        message: "Email sent successfully"
                    });
                }
            });
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getALlUser = async (req,res) =>{
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization});
        if(!UserDetail || !UserDetail.isAdmin) res.status(400).send("Invalid User Request");

        const obj = {isAdmin : false};
        req.params.id ? obj._id = mongoose.Types.ObjectId(req.params.id) : null;
        const userArray = await User.find(obj);

        res.status(200).send({message: "successFull",userList:userArray})
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getUser = async (req, res) => {
    try {
        const userArray = await User.find({});
        if(userArray.length){
            res.status(200).send(userArray)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const applicationData = await User.find({_id: id});
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
            res.status(400).send({message: "something went wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.ChangeActiveStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const UserDetail = await User.findOne({_id: id});
        if(UserDetail._id){
            const isUpdate = await User.updateOne({_id: id}, {isActive : !UserDetail.isActive});
            if (isUpdate) {
                res.status(200).send({message: "successFully Changed Status"})
            } else {
                res.status(400).send({message: "something Went Wrong"})
            }
        }else {
            res.status(400).send({message: "User Not Found"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getCountDetail = async (req, res) => {
    try{
        const userDetail = await User.find({});
        const DesPatchDetail = await DesPatch.find({});
        const InvoiceDetail = await Invoice.find({});
        const ProductDetail = await Product.find({});
        const PurchaseOrderDetail = await PurchaseOrder.find({});
        const SchemaDetail = await Schema.find({});
        const CreditDetail = await creditMemoSchema.find({});
        const DebitDetail = await debitMemoSchema.find({});

        const {authorization = ''} = req.headers;
        const roleDetail = await User.findOne({accessToken : authorization});
        const userId = roleDetail._id;
        const countDetail = [];

        const userDetailObject = {};
        const despatchDetailObject = {};
        const invoiceDetailObject = {};
        const productDetailObject = {};
        const PurchaseOrderDetailObject = {};
        const SchemaDetailObject = {};
        const creditDetailObject = {};
        const debitDetailObject = {};

        if(userDetail.length){
            if(roleDetail.isAdmin){
                const user = userDetail && userDetail.filter(item => item.isAdmin === false);
                if(user.length) {
                    const activeUser = user && user.filter(item => item.isActive === true);
                    const inActiveUser = user && user.filter(item => item.isActive === false);
                    if (user.length) {
                        userDetailObject.totalUser = user.length
                    }
                    if (activeUser.length) {
                        userDetailObject.activeUser = activeUser.length
                    }
                    if (inActiveUser.length) {
                        userDetailObject.inActiveUser = inActiveUser.length
                    }
                }
                countDetail.push(userDetailObject)
            }
        }
        if(DesPatchDetail.length){
            if(roleDetail.isAdmin) {
                despatchDetailObject.totalDespatch = DesPatchDetail.length;
                const DesPatchDetailLastTen = DesPatchDetail.filter((item) => {
                        return item.createdAt >= moment().add(-10, "days");
                });
                despatchDetailObject.last10DayDespatch = DesPatchDetailLastTen.length
            }else {
                const userDespatchDetail = DesPatchDetail.filter(item => item.userID.toString() === userId.toString())
                despatchDetailObject.totalDespatch = userDespatchDetail.length
                const userDespatchDetailLastTen = userDespatchDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                despatchDetailObject.last10DayDespatch = userDespatchDetailLastTen.length
            }
            countDetail.push(despatchDetailObject)
        }
        if(InvoiceDetail.length){
            if(roleDetail.isAdmin) {
                let total = 0;
                InvoiceDetail.forEach(item => {
                    total += item.invoiceValue;
                });
                const InvoiceDetailLastTen = InvoiceDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                let daysTotal = 0;
                InvoiceDetailLastTen.forEach(item => {
                    daysTotal += item.invoiceValue;
                });
                invoiceDetailObject.last10DayInvoice = InvoiceDetailLastTen.length;
                invoiceDetailObject.totalInvoice = InvoiceDetail.length;
                invoiceDetailObject.sumOfTotalInvoice = total;
                invoiceDetailObject.sumOfDaysInvoice = daysTotal;
            }else {
                const userInvoiceDetail = InvoiceDetail.filter(item => item.userID.toString() === userId.toString())
                let total = 0;
                userInvoiceDetail.forEach(item => {
                    total += item.invoiceValue;
                });
                const userInvoiceDetailLastTen = userInvoiceDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                let daysTotal = 0;
                userInvoiceDetailLastTen.forEach(item => {
                    daysTotal += item.invoiceValue;
                });
                invoiceDetailObject.totalInvoice = userInvoiceDetail.length
                invoiceDetailObject.last10DayInvoice = userInvoiceDetailLastTen.length;
                invoiceDetailObject.sumOfTotalInvoice = total;
                invoiceDetailObject.sumOfDaysInvoice = daysTotal;
            }
            countDetail.push(invoiceDetailObject)
        }
        if(ProductDetail.length){
            if(roleDetail.isAdmin) {
                productDetailObject.totalProduct = ProductDetail.length;
                const ProductDetailLastTen = ProductDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                productDetailObject.last10DayProductDetail = ProductDetailLastTen.length;
            }else {
                const userProductDetail = ProductDetail.filter(item => item.userID.toString() === userId.toString())
                productDetailObject.totalProduct = userProductDetail.length;
                const userProductDetailLastTen = userProductDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                productDetailObject.last10DayProductDetail = userProductDetailLastTen.length;
            }
            countDetail.push(productDetailObject)
        }
        if(PurchaseOrderDetail.length){
            if(roleDetail.isAdmin) {
                PurchaseOrderDetailObject.totalPurchaseOrder = PurchaseOrderDetail.length;
                const PurchaseOrderDetailLastTen = PurchaseOrderDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                PurchaseOrderDetailObject.last10DayPurchaseOrderDetail = PurchaseOrderDetailLastTen.length;
            }else {
                const userPurchaseOrder = PurchaseOrderDetail.filter(item => item.userID.toString() === userId.toString())
                PurchaseOrderDetailObject.totalPurchaseOrder = userPurchaseOrder.length;
                const userPurchaseOrderLastTen = userPurchaseOrder.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                PurchaseOrderDetailObject.last10DayPurchaseOrderDetail = userPurchaseOrderLastTen.length;
            }
            countDetail.push(PurchaseOrderDetailObject)
        }
        if(SchemaDetail.length){
            if(roleDetail.isAdmin) {
                SchemaDetailObject.totalSchema = SchemaDetail.length
                const SchemaDetailLastTen = SchemaDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                SchemaDetailObject.last10DaySchemaDetail = SchemaDetailLastTen.length;
            }else {
                const userSchema = SchemaDetail.filter(item => item.userID.toString() === userId.toString());
                SchemaDetailObject.totalSchema = userSchema.length;
                const userSchemaLastTen = userSchema.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                SchemaDetailObject.last10DaySchemaDetail = userSchemaLastTen.length;
            }
            countDetail.push(SchemaDetailObject)
        }
        if(CreditDetail.length){
            if(roleDetail.isAdmin) {
                creditDetailObject.totalCredit = CreditDetail.length;
                const CreditDetailLastTen = CreditDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                creditDetailObject.last10DayCreditDetail = CreditDetailLastTen.length;
            }else {
                const userCredit = CreditDetail.filter(item => item.userID.toString() === userId.toString());
                creditDetailObject.totalCredit = userCredit.length;
                const userCreditLastTen = userCredit.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                creditDetailObject.last10DayCreditDetail = userCreditLastTen.length;
            }
            countDetail.push(creditDetailObject)
        }
        if(DebitDetail.length){
            if(roleDetail.isAdmin) {
                debitDetailObject.totalDebit = DebitDetail.length;
                const DebitDetailLastTen = DebitDetail.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                debitDetailObject.last10DayDebitDetail = DebitDetailLastTen.length;
            }else {
                const userDebit = DebitDetail.filter(item => item.userID.toString() === userId.toString());
                debitDetailObject.totalDebit = userDebit.length;
                const userDebitLastTen = userDebit.filter((item) => {
                    return item.createdAt >= moment().add(-10, "days");
                });
                debitDetailObject.last10DayDebitDetail = userDebitLastTen.length;
            }
            countDetail.push(debitDetailObject)
        }
        res.status(200).send({message: "successFull",countList: countDetail})
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getCountry = async (req,res) => {
    try {
        const response = await axios.get(`https://api.trevy.ai/nichesuite-webservices/service/user/accounts/getChoiceListForCountry`,{
            headers: {
                'app-key' : '2b845f01-789f-4d2f-a864-24075721408e',
                'user-code' : '1-1'
            }
        });
        if(response.status === 200){
            res.status(200).send(response.data)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getState = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.get(`https://api.trevy.ai/nichesuite-webservices/service/user/accounts/getChoiceListForState/${id}`,{
            headers: {
                'app-key' : '2b845f01-789f-4d2f-a864-24075721408e',
                'user-code' : '1-1'
            }
        });
        if(response.status === 200){
            res.status(200).send(response.data)
        }else {
            res.status(201).send({message: "data does not exist"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
