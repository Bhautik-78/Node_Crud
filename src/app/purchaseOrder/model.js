const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const purchaseOrderSchema = new Schema({
    PONumber : Number,
    Date : String,
    NoOfItems: Number,
    value : Number,
    status : String,
    paymentReceived: String,
    deliveryStatus : String
});

module.exports = mongoose.model( "purchaseOrder", purchaseOrderSchema );
