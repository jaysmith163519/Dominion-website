let mongoose = require('mongoose')
let expenseSchema = mongoose.Schema({
    description: {
        type: String,
        minlength: 5,
        maxlength: 200,

        required: true
    },
    purpose: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    amount: {
        type: Number,
        required: true
    },
    category: [{
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }],
    incuredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
    }
})
expenseSchema.index({ description: 1 })
expenseSchema.index({ purpose: 1 })
expenseSchema.index({ amount: 1 })
expenseSchema.index({ category: 1 })
module.exports = mongoose.model('expense', expenseSchema)
