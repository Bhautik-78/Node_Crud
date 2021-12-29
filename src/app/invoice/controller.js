const mongoose = require("mongoose");
const User = require("../auth/model");
const paymentReport = require("../vendorPaymentReport/model");
const excel = require("exceljs");
const XLSX = require("xlsx");
const moment = require("moment")
const Invoice = mongoose.model("invoice");
require('dotenv').config();

exports.createApplication = async (req, res) => {
    try {
        const uniq = await Invoice.find({invoiceNumber : req.body.invoiceNumber});
        if(uniq.length){
            res.status(400).send({message: "Invoice Number Already Exist"})
        }else {
            const isCreated = await Invoice.create(req.body);
            if (isCreated) {
                res.status(200).send({message: "successFully created"})
            } else {
                res.status(400).send({message: "something Went Wrong"})
            }
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplication = async (req, res) => {
    try {
        const {invoiceNumber = '', startDate = '', endDate = '', userID= ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        let applicationData = []
        let query = {};
        if (invoiceNumber !== '') {
            query.invoiceNumber =  invoiceNumber
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.invoiceDate = {$gte:startDate,$lte:endDate}
            }else {
                query.invoiceDate = {$gte:startDate}
            }
        }
        if(userID !== ''){
            query.userID = userID
        }
        applicationData = await Invoice.find(query);
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
        const applicationData = await Invoice.find({_id: id})
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
        const isUpdate = await Invoice.updateOne({_id: req.params.id}, req.body);
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
        const isDeleted = await Invoice.deleteOne({_id: req.params.id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.downloadExcel = async (req, res) => {
    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("sample");
        worksheet.columns = [
            {header: "PONumber", key: "PONumber", width: 20},
            {header: "PODate", key: "PODate", width: 20},
            {header: "invoiceNumber", key: "invoiceNumber", width: 20},
            {header: "invoiceDate", key: "invoiceDate", width: 20},
            {header: "NoOfPackages", key: "NoOfPackages", width: 20},
            {header: "netWeight", key: "netWeight", width: 20},
            {header: "grossWeight", key: "grossWeight", width: 20},
            {header: "invoiceValue", key: "invoiceValue", width: 20},
            {header: "CGSTValue", key: "CGSTValue", width: 20},
            {header: "SGSTValue", key: "SGSTValue", width: 20},
            {header: "IGSTValue", key: "IGSTValue", width: 20},
            {header: "paymentReceived", key: "paymentReceived", width: 20},
        ];
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "sampleInvoiceSheet.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

const processExcel = workbook => {
    const sheetNamesList = workbook.SheetNames;
    const filesData = {};
    sheetNamesList.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const headers = {};
        const data = [];
        for (const z in worksheet) {
            if (z[0] === "!") continue;
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break
                }
            }
            const col = z.substring(0, tt)
            const row = parseInt(z.substring(tt))
            const value = worksheet[z].v
            if (row == 1 && value) {
                headers[col] = value;
                continue
            }
            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value
        }
        data.shift();
        data.shift();
        filesData[sheetName] = data
    })
    return filesData
}

exports.uploadExcel = async (req, res) => {
    try {
        const promiseBuilder = {
            updateAppPromise: (payload, userID) => new Promise(async (resolve) => {
                payload.PODate = moment(payload.PODate).format("YYYY-MM-DD")
                payload.invoiceDate = moment(payload.invoiceDate).format("YYYY-MM-DD")
                payload.userID = userID;
                const isCreated = await Invoice.create(payload);
                if (isCreated && isCreated._id) {
                    return resolve({success: true})
                } else {
                    return resolve({success: false})
                }
            })
        };
        const {userID} = req.body;
        const {file} = req;
        const workbook = XLSX.readFile(`./uploads/${file.originalname}`, {
            cellDates: true
        })
        let payload = [];
        const allPromises = [];
        const data = processExcel(workbook);
        Object.keys(data).forEach(v => {
            const filter = data[v]
            payload.push(...filter)
        });

        const obj = await Invoice.find({});

        const invoiceList = obj.map(item => item.invoiceNumber);

        const removePayload = [];
        payload.forEach((item, index) => (
            (invoiceList.includes(item.invoiceNumber) ? removePayload.push(index + 1) : "")
        ))
        payload = payload.filter(item => !invoiceList.includes(item.invoiceNumber))

        if (!removePayload.length) {
            const filteredArr = payload.reduce((acc, current) => {
                const x = acc.find(item => item.invoiceNumber === current.invoiceNumber);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            if (filteredArr && filteredArr.length > 0) {
                filteredArr.forEach(item => {
                    allPromises.push(promiseBuilder.updateAppPromise(item, userID))
                });
                await Promise.all(allPromises).then(values => {
                    if (values.some(value => value.success)) {
                        res.status(200).send({success: true, message: "Successfully created"})
                    } else {
                        res.status(400).send({success: false, message: "There are not records are found!"})
                    }
                })
            } else {
                res.status(400).send({success: false, message: "No Data Found"})
            }
        }else {
            res.status(201).send({status: false, message: `Row no. ${removePayload.toString()} Invoice Number duplicated`})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getInvoiceNumList = async (req, res) => {
    try {
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        if(UserDetail){
            const applicationData = await Invoice.find({userID: UserDetail._id})
            if(applicationData.length){
                const numList = applicationData.map(item => item.invoiceNumber)
                res.status(200).send(numList)
            }else {
                res.status(201).send({message: "data does not exist"})
            }
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getInvoiceValue = async (req, res) => {
    try {
        const {id} = req.params;
        const applicationData = await Invoice.findOne({invoiceNumber: id});
        const vendorData = await paymentReport.find({invoiceNumber: applicationData.invoiceNumber});
        if(applicationData){
            const invoiceValue = applicationData.invoiceValue;
            if(vendorData.length){
                let total = 0;
                vendorData.forEach(item => {
                    total += item.amount;
                });
                const finalValue = invoiceValue - total;
                res.status(200).send({invoiceValue : finalValue})
            }else {
                res.status(200).send({invoiceValue : invoiceValue})
            }
        }else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
