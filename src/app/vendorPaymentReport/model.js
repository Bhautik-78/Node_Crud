const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userRole" },
    paymentDate : String,
    paymentMode : String,
    amount : Number,
    Remarks : String
}, {
    timestamps: true,
});

module.exports = mongoose.model( "vendorPaymentReport", paymentSchema );
