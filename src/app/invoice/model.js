const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    PONumber : Number,
    PODate : String,
    invoiceNumber : Number,
    invoiceDate : String,
    NoOfPackages : Number,
    Weight : Number,
    invoiceValue : Number,
    CGSTValue : Number,
    paymentReceived : Number
});

module.exports = mongoose.model( "invoice", invoiceSchema );
