const mongoose = require("mongoose");
const excel = require("exceljs");
const XLSX = require("xlsx");
const _ = require("lodash");
const moment = require("moment")
const Product = mongoose.model("product");
const Schema = mongoose.model("schema");
const dummyData = require("../../JSON/dummyData");
const User = require("../auth/model");
require('dotenv').config();

exports.getApplication = async (req, res) => {
    try {
        const {productName = '', EANCode = '', SKUCode = '', startDate = '', endDate = ''} = req.query;
        const {authorization = ''} = req.headers;
        const UserDetail = await User.findOne({accessToken : authorization})
        let applicationData = []
        let query = {};
        if (productName !== '') {
            query.productName = {$regex: new RegExp("^" + productName, "i")}
        }
        if (EANCode !== '') {
            query.EANCode = EANCode
        }
        if (SKUCode !== '') {
            query.SKUCode = SKUCode
        }
        if (startDate !== '') {
            if (endDate !== '') {
                query.dateOfAvailability = {$gte: startDate, $lte: endDate}
            } else {
                query.dateOfAvailability = {$gte: startDate}
            }
        }
        applicationData = await Product.find(query);
        if(!UserDetail.isAdmin){
            applicationData = applicationData.filter(item => item.userID == UserDetail._id)
        }
        if (applicationData.length) {
            const data = applicationData.map((item) => {
                item = JSON.parse(JSON.stringify(item));
                delete item.schemaList;
                return item
            });
            res.status(200).send(data)
        } else {
            res.status(201).send({message: "data does not exist"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.getApplicationFormEAN = async (req, res) => {
    try {
        const {EANCode} = req.query;
        let query = {};
        if (EANCode !== null) {
            query = {
                EANCode: EANCode
            }
        }
        const applicationData = await Product.find(query);
        const schemaData = await Schema.find(query);
        const sortingList = schemaData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        const schemaObject = sortingList.map(item => ({
            id: item._id,
            schemaName: item.schemaName
        }));

        applicationData[0].schemaList = schemaObject || [];

        if (applicationData.length) {
            res.status(200).send(applicationData)
        } else {
            res.status(201).send({message: "data does not exist"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.createApplication = async (req, res) => {
    try {
        const isCreated = await Product.create(req.body)
        if (isCreated) {
            res.status(200).send({message: "successFully created"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.editApplication = async (req, res) => {
    try {
        const isUpdate = await Product.updateOne({_id: req.params.id}, req.body);
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
        const isDeleted = await Product.deleteOne({_id: req.params.id});
        if (isDeleted) {
            res.status(200).send({message: "successFully deleted"})
        } else {
            res.status(400).send({message: "something Went Wrong"})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

const processExcel = workbook => {
    const sheetNamesList = workbook.SheetNames
    const filesData = {}
    sheetNamesList.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const headers = {}
        const data = []
        for (const z in worksheet) {
            if (z[0] === "!") continue
            let tt = 0
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i
                    break
                }
            }
            const col = z.substring(0, tt)
            const row = parseInt(z.substring(tt))
            const value = worksheet[z].v
            if (row == 1 && value) {
                headers[col] = value
                continue
            }
            if (!data[row]) data[row] = {}
            data[row][headers[col]] = value
        }
        data.shift()
        data.shift()
        filesData[sheetName] = data
    })
    return filesData
}

exports.uploadExcel = async (req, res) => {
    try {
        const promiseBuilder = {
            updateAppPromise: (payload) => new Promise(async (resolve) => {
                payload.dateOfAvailability = moment(payload.dateOfAvailability).format("YYYY-MM-DD")
                const isCreated = await Product.create(payload);
                if (isCreated && isCreated._id) {
                    return resolve({success: true})
                } else {
                    return resolve({success: false})
                }
            })
        };

        const {file} = req;
        const workbook = XLSX.readFile(`./uploads/${file.originalname}`, {
            cellDates: true
        })
        let payload = [];
        const allPromises = [];
        const data = processExcel(workbook)
        Object.keys(data).forEach(v => {
            const filter = data[v]
            payload.push(...filter)
        });

        const obj = await Product.find({});

        const EANList = obj.map(item => item.EANCode);

        const removePayload = []
        payload.forEach((item, index) => (
            (EANList.includes(item.EANCode) ? removePayload.push(index + 1) : "")
        ))
        payload = payload.filter(item => !EANList.includes(item.EANCode))

        if (!removePayload.length) {
            const filteredArr = payload.reduce((acc, current) => {
                const x = acc.find(item => item.EANCode === current.EANCode);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            if (filteredArr && filteredArr.length > 0) {
                filteredArr.forEach(item => {
                    allPromises.push(promiseBuilder.updateAppPromise(item))
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
        } else {
            res.status(201).send({status: false, message: `Row no. ${removePayload.toString()} EAN Code duplicated`})
        }
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};

exports.downloadExcel = async (req, res) => {
    try {

        const schema = await Schema.find({});
        const scheamList = Array.isArray(schema) ? schema.map(item => item.schemaName) : []
        const str = scheamList.toString();
        const backToArr = [`"${str.split()}"`];

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("sample");

        worksheet.columns = [
            {header: "productName", key: "productName", width: 20},
            {header: "brandName", key: "brandName", width: 20},
            {header: "productImage", key: "productImage", width: 20},
            {header: "productCategory", key: "productCategory", width: 20},
            {header: "SKUCode", key: "SKUCode", width: 20},
            {header: "HSNCode", key: "HSNCode", width: 20},
            {header: "EANCode", key: "EANCode", width: 20},
            {header: "shelfLifeDays", key: "shelfLifeDays", width: 20},
            {header: "UOM", key: "UOM", width: 20},
            {header: "UOMConversation", key: "UOMConversation", width: 20},
            {header: "quantity", key: "quantity", width: 20},
            {header: "dateOfAvailability", key: "dateOfAvailability", width: 20},
            {header: "active", key: "active", width: 20},
            {header: "MRP", key: "MRP", width: 20},
            {header: "sellingPrice", key: "sellingPrice", width: 20},
            {header: "remarks", key: "remarks", width: 20},
            {header: "schemes", key: "schemes", width: 20, type: "list"},
            {header: "margin", key: "margin", width: 20},
        ];

// Add Array Rows
//       worksheet.addRows(dummyData);

        worksheet.dataValidations.add('Q2:Q9999', {
            type: 'list',
            allowBlank: false,
            showErrorMessage: true,
            promptTitle: 'The value must be schema List',
            prompt: 'The value must be schema List',
            formulae: backToArr
        });

// res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "sampleProductionSheet.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
