const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    firstName : String,
    lastName : String,
    mobileNumber:Number,
    email : String,
    passWord : String,
    isAdmin : {
        type: Boolean,
        default : false
    },
    accessToken : String,
    isActive : {
        type: Boolean,
        default : false
    }
});

module.exports = mongoose.model( "userRole", userRoleSchema );
