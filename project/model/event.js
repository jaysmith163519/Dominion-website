let mongoose = require('mongoose');
let eventschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
        minlength: 3
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: false
    },
    comment: {
        type: String

    },

    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        maxlength: 50,
        minlength: 3,
        required: true

    },
    image: [{
        url: {
            type: String,

        },

        publicId: String,
        alt: String
    }],
    RSVP: {
        type: String,
        enum: ['yes', 'no', 'maybe', 'pending'],
        default: 'pending'

    },
    task: [{
        AssignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        todo: {
            type: String,
            minlength: [5, 'task must be at least 5 characters'],
            maxlength: [100, 'task must be at most 100 characters']


        },
        compeleted: {
            status: {
                type: Boolean,
                default: false
            },
            completedAt: {
                type: Date,
                default: null
            }
        }
    }]





})
eventschema.index({ createdBy: 1, date: 1 }, { unique: true })
module.exports = mongoose.model('Event', eventschema)