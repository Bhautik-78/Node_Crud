const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    firstName: String,
    lastName: String,
    mobileNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (value.toString().length!==10) {
                throw new Error('Mobile Is Not Valid !')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                throw new Error('Email Is Not Valid !')
            }
        }
    },
    passWord: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    userImg : String,
    accessToken: String,
    isActive: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("userRole", userRoleSchema);
