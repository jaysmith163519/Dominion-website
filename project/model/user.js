let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')
let userSchema = mongoose.schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
        trim: true,

    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
        trim: true

    },
    PhoneNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 10,
        max: 10,
        trim: true,
        match: [/^\+254[17]\d{8}$/, 'Invalid phone number']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [20, "Password must be less than 20 characters long"],
        trim: true,
        match: [[/^[a-zA-Z0-9!@#$%^&*() -+=]{8,20}$/, 'PROVIDE A STRONG PASSWORD']]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    preference: {

        screen: {
            type: String,
            enum: ['light', 'dark'],
            default: "dark"
        }
        ,
        Notification: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        }
    }, isactive: {
        type: Boolean,
        default: true
    },
    islogin: {
        type: Boolean,
        default: false
    },
    address: {
        city: String,
        state: String,
        town: String,
        country: String
    },
    lastlogin: {
        type: Date,
        default: Date.now()
    },
    emailisverified: {
        type: Boolean,
        default: true
    },
    fcmToken:
        [{
            token: {
                type: String,
                required: true,
            }
            , createAt: {
                type: Date,
                default: Date.now()

            },
            deviceInfo: {
                type: String,
                default: "unknown"
            }



        }]
    , refreshToken: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            expireAt: '30d'

        }

    }],
    birthday: {
        type: Date,
        required: true,


    },
    profilePicture:{
        url:{type:String,
            default:"https://cdn.discordapp.com/embed/avatars/0.png"},
        createdAt:{type:Date,
            default:Date.now}
    },
    bio:{
        Message:
        {type: String,
            maxlength: 200,
            minlength: 3,
        default: 'heloo there',},
        createdAt:{type:Date, 
            default:Date.now()
        }},
    achievements: { 
       
        createdAt:{
            type:Date,
            default:Date.now()},
            badge:{url:String,
                name:String,
                description:String,
                
                }
}

    








})
userSchema.index({email:1});
userSchema.index({password:1})
userSchema.index({firstName:1})
userSchema.index({lastName:1})
userSchema.index({birthday:1})

userSchema.pre('save', async function (next) {
    if (!this.isModified(
        'password'
    )) {
        return next()
    }
    try {
        this.password = await bcrypt.hash(this.password, 20)
        next()

    }
    catch (error) {
        return next(error)
    }

})
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password);
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
userSchema.virtual('fullName').get(function() {
    return`${this.firstName} ${this.lastName}`
}
)
userSchema.methods.birthday= function() {
    if(this.birthday==null) return null
    let age = new Date().getFullYear()-this.birthday.getFullYear()
    let month = new Date().getMonth()
    let day=new Date().getDate()
    let fullname = `${this.firstName} ${this.lastName}`
    let minDays=10;
    if (this.birthday.getDate()-day<minDays){
        return {age,fullname,message:`prepare yourself a birthday gift soon for your dear ${fullname}! have a wonderful time! wishing you a fantastic year ahead!`}
    }

    if (month==this.birthday.getMonth()
        &&day==this.birthday.getDate()){

        return {age,fullname ,message:`Happy Birthday ${fullname}!`}
    }


};
userSchema.methods.addRefreshToken = function(refreshToken){
    this.refreshToken.push(refreshToken)
    return this.save()
}
userSchema.methods.removeRefreshToken = function (refreshToken){
    this.refreshToken= this.refreshToken.filter(token=> token !==refreshToken)
    return this.save()
}
userSchema.virtual('userRole').get(function(){
    return this.role === 'admin' ? 'admin' : 'user';
})
userSchema.methods.generateAccessToken = function(){
    return jwt.sign( {id:this.id,role:this.role},process.env.JWTsigningKey,{
        expiresIn:'1d'
    }  

    )
}


module.exports=userSchema.model('user','userSchema')