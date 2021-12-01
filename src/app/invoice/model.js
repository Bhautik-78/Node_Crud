const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    PONumber : Number,
    PODate : String,
    invoiceNumber : Number,
    invoiceDate : String,
    NoOfPackages : Number,
    netWeight : Number,
    grossWeight : Number,
    invoiceValue : Number,
    CGSTValue : Number,
    SGSTValue : Number,
    IGSTValue : Number,
    paymentReceived : Number
});

module.exports = mongoose.model( "invoice", invoiceSchema );
