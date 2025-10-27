let  mongoose = require('mongoose');
let dailySermonSchema= mongoose.Schema({
    author:{ype:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    

 },
 topic:{
    type:String,
    trim:true,
    minlength:5,
    maxlength:50
 },
 comments:[{ commentedBy:{types:mongoose.Schema.Types.ObjectId,
    ref:'user',
    


 },
comment:{type:String,
    maxlength:200,
    minlength:5
},
createdAt:{type:Date,
    default:Date.now
}
}],
content:{
    type:String,
    minlength:5,
    maxlength:500
},
scriptureRef:{
    type:String,
    minlength:5,
    maxlength:100
},
weekIndentifier:{
    types:String,
    unique:true,
    required:true,
    minlength:5,
    maxlength:50

},
submissionDate:{
    type:Date,
    default:Date.now()
    

},
isSelected:{type:Boolean,
    default:false
}

})
dailySermonSchema.index({author:1})
dailySermonSchema.index({
    weekIndentifier:1
})
dailySermonSchema.index({
    isSelected:1})
dailySermonSchema.method.numberOfComment=function(){
        let num = this.comments.length;
        return num
    }
        
    module.exports=mongoose.model('dailySermon',dailySermonSchema)
    
