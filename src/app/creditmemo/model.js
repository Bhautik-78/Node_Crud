const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const creditMemoSchema = new Schema({
    userID : String,
    productName: String,
    vendorInvoiceRef_Date: String,
    eMetroPoRef_Date: String,
    description: String,
    itemQuantity: Number,
    HSNCode: Number,
    unitPrice: Number,
    priceDifference: Number,
    taxRate: Number,
    CGST: Number,
    SGST: Number,
    IGST: Number,
    amount: Number
}, {
    timestamps: true,
});

module.exports = mongoose.model("creditMemo", creditMemoSchema);
