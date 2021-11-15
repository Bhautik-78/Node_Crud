const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const desPatchNoteSchema = new Schema({
    DCNumber : String,
    DateOfDeliverChallan : String,
    PONumber : Number,
    PODate : String,
    NumberOfCarton: Number,
    TransporterDetails : String,
    DriverName : String,
    DriverContact: Number,
    VehicleNumber : String
});

module.exports = mongoose.model( "desPatchNote", desPatchNoteSchema );
