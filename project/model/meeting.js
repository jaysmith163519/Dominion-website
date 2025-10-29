let mongoose = require('mongoose');
let meetingSchema = mongoose.schema({
    topic: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true


    },
    date: { type: date, required: true },
    videoCodeUrl: {
        type: String,
        required: true,
        trim: true,
        match: /^https:\/$/

    },
    presentationUrl: {
        string: true,
        trim: true,
        match: /^https:\/$/
    },
    summary: {
        type: String,
        minlength: 3,
        maxlength: 500
    },
    weekIndentifier: {
        type: string,
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },



})
meetingSchema.index({ title: 1 })
meetingSchema.index({ videoCodeUrl: 1 })
meetingSchema.index({ presentationUrl: 1 })
meetingSchema.index({ weekIndentifier: 1 })
module.exports = mongoose.model('meeting', meetingSchema)