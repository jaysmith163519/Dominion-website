let mongoose= require('mongoose');
 let prayerRequestSchema=mongoose.Schema({
    requestedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true

        

    },
    request:{
        type:string,

        trim:true
    },
    anonymous:{
        type:Boolean,
        default:false    

    },
    status:{
        type:string,
        enum:['Pending','Accepted','canceled','Active','Archieved'],
        default:'pending'

    },
    prayers:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }, CreatedAt:{
            type:Date,
            default:Date.now
        }

    }]


    
    
 })
 module.exports= mongoose.model('prayerRequest',prayerRequestSchema)