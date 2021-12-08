const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const purchaseOrderSchema = new Schema({
    userID : String,
    PONumber : Number,
    PODate : String,
    EANCode : Number,
    HSNCode : Number,
    ItemName : String,
    PrimaryBarCode : String,
    SKUCode : Number,
    purchaseQty : Number,
    caseQuantity : Number,
    MRP : Number,
    BuyerMarginPer : String,
    buyerMarginAmt : Number,
    billingPrice : Number,
    taxRate : String,
    SGSTAmt : Number,
    CGSTAmt : Number,
    IGSTAmt : Number,
    totalPrice : Number,
    secondaryBarcode : String,
    packingLabel : String,
    documentUpload : String,
    deliveryLocation : String,
    NoOfItems: Number,
    value : Number,
    status : String,
    paymentStatus : String,
    deliveryStatus : String,
    itemList : []
});

module.exports = mongoose.model( "purchaseOrder", purchaseOrderSchema );
