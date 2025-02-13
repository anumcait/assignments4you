const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    }
},{timestamps: true});

const User = mongoose.model('User',userSchema);
module.exports = User;