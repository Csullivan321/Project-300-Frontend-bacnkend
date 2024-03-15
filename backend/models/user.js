const mongoose = require('mongoose')
//var Int32 = require('mongoose-int32')

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address1:{
        type:String,
        Required:true
    },
    address2:{
        type:String,
        Required:true
    },
    county:{
        type:String,
        Required:true
    },
    phone:{
        type: Number,
        Required:true
    },

    appointments:[{type: mongoose.Schema.Types.ObjectId, ref: "Appointments"}]
    
})

module.exports = mongoose.model("User", userSchema)