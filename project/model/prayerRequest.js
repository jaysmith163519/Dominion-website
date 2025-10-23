let mongoose= require('mongoose');
 let prayerRequestSchema= new mongoose.Schema({
    requestedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        CreatedAt:{type:Date,default:Date.now()}

        

    },
    request:{
        type:string,

        trim:true,
        required:true
    },
    anonymous:{
        type:Boolean,
        default:false    

    },
    status:{
        type:string,
        enum:['Pending','Accepted','canceled','Active','Archieved'],
        default:'pending',
        CreatedAt:{
            type:Date,
            default:Date.now
        }
          
        },

    
    prayers: [{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }, CreatedAt:{
            type:Date,
            default:Date.now
        }

    }]


    
    
 })
 prayerRequestSchema.index({requestedby:1})
 prayerRequestSchema.index({requestedby:1,status:1})
 prayerRequestSchema.index({prayers:1})
 prayerRequestSchema.index({request:1})
 
 prayerRequestSchema.methods.numberOfPrayers = function() {
    return this.prayers.length;
};
module.exports= mongoose.model('prayerRequest',prayerRequestSchema);
     

 
