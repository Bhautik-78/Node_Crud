const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    firstName : String,
    lastName : String,
    mobileNumber:Number,
    email : String,
    passWord : String,
    isAdmin : Boolean,
    accessToken : String
});

module.exports = mongoose.model( "userRole", userRoleSchema );
