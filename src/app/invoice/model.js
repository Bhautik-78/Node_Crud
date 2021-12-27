const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    userID : String,
    PONumber : Number,
    PODate : String,
    invoiceNumber : {
        type: Number,
        unique: true,
    },
    invoiceDate : String,
    NoOfPackages : Number,
    netWeight : Number,
    grossWeight : Number,
    invoiceValue : Number,
    CGSTValue : Number,
    SGSTValue : Number,
    IGSTValue : Number,
    paymentReceived : Number
}, {
    timestamps: true,
});

module.exports = mongoose.model( "invoice", invoiceSchema );
