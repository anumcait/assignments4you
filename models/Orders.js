const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    subject:{
        type:String,
        required:true
    },
    university:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    wordCount:{
        type:String,
        required:false
    },
    pages:{
        type:String,
        required:false
    },
    orderStatus:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:false
    },
    description:{
        type:String,
        required:false
    },
    files:[{
        type:String, //can be a URL or path to the file
        required: false
    }]
}, {timestamps: true});

module.exports = mongoose.model('Order',orderSchema)