const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PhoneSchema = new Schema({
    sku: {
        type: Number,
        required: true
    },
    prodImg: {
        type: String,
        required: true
    },
    prodHref: {
        type: String,
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    prodDesc: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
},
{
    timestamps: true,
})

module.exports = mongoose.model('Phone', PhoneSchema)