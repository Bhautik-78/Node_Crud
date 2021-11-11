const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productCategory : String,
    productName : String,
    brandName : String,
    MRP : Number,
    quantity: Number,
    dateOfAvailability : String,
    sellingPrice : Number,
    productImage: String,
    SKUCode : Number,
    HSNCode : Number,
    EANCode : Number,
    shelfLifeDays : Number,
    UOM : String,
    UOMConversation : String,
    margin : Number,
    schemes : String,
    remarks : String,
    active : Boolean,
});

module.exports = mongoose.model( "product", productSchema );
