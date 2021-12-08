const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID : String,
    schemaName : String,
    date : String,
    productName : String,
    EANCode : Number,
    quantity : Number,
    freeQuantity : Number,
    netPTR : String,
    UOM : String,
    discount : Number,
    validity : String,
    nararation : String,
    active : Boolean,
    schemaNumber : Number
});

module.exports = mongoose.model( "schema", userSchema );
