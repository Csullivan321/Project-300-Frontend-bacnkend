const mongoose = require('mongoose')
//var Int32 = require('mongoose-int32')

const bookingSchema = new mongoose.Schema({
     
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
         
        required:true
    },
    carMake:{
        type:String,
        //required:true
    },
    carModel:{
        type:String,
        //Required:true
    },
    registeration:{
        type:String,
        //Required:true
    },
    service:{
        type:String,
        //Required:true
    },
    phone:{
        type: Number,
        //Required:true
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    

    
    
})

module.exports = mongoose.model("Booking", bookingSchema)