let mongose = require('mongoose')
let albumSchema = new mongose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50

    },
    description: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 200
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    photo: [{
        url: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    likes: [{
        like: {
            type: Boolean,
            default: false
        },

        user: {
            type: mongose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }], comments: [{
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now()
        },
        createdBy: {
            type: mongose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }

    }]

})
albumSchema.index({ title: 1 });
albumSchema.index({ createdAt: 1 });
albumSchema.index({ createdBy: 1 });;
albumSchema.index({ photo: 1 });
albumSchema.index({ like: 1 })
albumSchema.index({ comments: 1 })


albumSchema.method.countLikes = function () {
    return this.likes.length;
}
albumSchema.model.comments = async function () {
    let count = this.comments.length;
    let comment = this.comments.sort((a, b) => b.createdAt - a.createdAt);
    return { count, comment };
}


module.exports = mongoose.model('album', albumSchema);