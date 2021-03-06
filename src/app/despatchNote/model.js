const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const desPatchNoteSchema = new Schema({
    userID : String,
    DCNumber : String,
    DateOfDeliverChallan : String,
    PONumber : Number,
    PODate : String,
    NumberOfCarton: Number,
    TransporterDetails : String,
    DriverName : String,
    DriverContact: Number,
    VehicleNumber : String,
    eWayBillNumber : Number,
    totalNoOfPackages : Number,
    netWeightInKgs : Number,
    grossWeightInKgs : Number,
    deliveryLocation : String,
    eMetroRepresentativeID : String
}, {
    timestamps: true,
});

module.exports = mongoose.model( "desPatchNote", desPatchNoteSchema );
