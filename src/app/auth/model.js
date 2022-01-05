const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    vendor_name : String,
    vendor_Address_code : String,
    address_Line1 : String,
    address_Line2 : String,
    postal_Code : Number,
    state : String,
    country_id : String,
    city : String,
    vendor_Code : Number,
    system_Vendor_id : String,
    firstName: String,
    middleName: String,
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
    panNo: String,
    bankName : String,
    accountNumber: Number,
    IFSCCode : String,
    paymentTerms: String,
    shippingTerms: String,
    GST: String,
    vendorType: String,
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
}, {
    timestamps: true,
});

module.exports = mongoose.model("userRole", userRoleSchema);
