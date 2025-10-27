const { text } = require('express')
let mongoose = require('mongoose')
let pollSchema = mongoose.Schema({
    question: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',

        required: true
    },
    createdAt: {
        type: Date,

    },
    option: [{
        text: String,

        vote: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true }]
    }],
    expireAt:
    {
        type: Date,

    }



})
pollSchema.index({ expireAt: 1 })
pollSchema.method.countVotes = function () {
    return this.option.map(vot => {
        let text = vot.text
        let noOfvotes = vot.vote.length;
        return { text, noOfvotes }
    })
}
pollSchema.method.getWinner = function () {
    let winner = this.option.reduce((prev, curr) => {
        return prev.vote.length > curr.vote.length ? prev : curr
    })
    return winner
}
module.exports = pollSchema.model('poll', 'pollSchema')
