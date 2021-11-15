const mongoose = require("mongoose");
const XLSX = require("xlsx");
const _ = require("lodash");
const Product = mongoose.model("product");
const Schema = mongoose.model("schema");
require('dotenv').config();

exports.getApplication = async (req, res) => {
    try {
        const {productName = '', EANCode = '', SKUCode = '', startDate = '', endDate = ''} = req.query;
        let query = {};
        if (productName !== '') {
            query.productName =  { $regex : new RegExp("^" + productName, "i") }
        }
        if(EANCode !== ''){
            query.EANCode = EANCode
        }
        if(SKUCode !== ''){
            query.SKUCode = SKUCode
        }
        if(startDate !== ''){
            if(endDate !== ''){
                query.dateOfAvailability = {$gte:startDate,$lte:endDate}
            }else {
                query.dateOfAvailability = {$gte:startDate}
            }
        }
        const applicationData = await Product.find(query);
        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
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
        const sortingList = schemaData.sort((a,b) => {
            return new Date(b.date) - new Date(a.date);
        });
        const schemaObject = sortingList.map(item => ({
            id : item._id,
            schemaName : item.schemaName
        }));

        applicationData[0].schemaList = schemaObject || [];

        if(applicationData.length){
            res.status(200).send(applicationData)
        }else {
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
        console.log("isDeleted", isDeleted)
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
                const isCreated = await Product.create(payload);
                if (isCreated && isCreated._id) {
                    return resolve({success: true})
                }else {
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

        payload = payload.filter(item => !EANList.includes(item.EANCode))

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
    }catch (err) {
        res.status(500).send({message: err.message || "data does not exist"});
    }
};
