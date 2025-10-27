let mongoose = require('mongoose')
let contributionSchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 50,

        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    member: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',

        },
        amount: {
            type: Number,
            min: 100,

        },
        date: {
            type: Date,
            default: Date.now()

        }

    }],
    createdAt: {
        type: Date,

    }

})
contributionSchema.index({ member: 1 });
contributionSchema.index({ title: 1 });
contributionSchema.index({ description: 1 })

contributionSchema.methods.totalAmmount = async function () {
    let total = this.member.reduce((Prev, cur) => {
        return Prev + cur.amount
    }, 0)
}
module.exports = mongoose.model('contribution', contributionSchema)