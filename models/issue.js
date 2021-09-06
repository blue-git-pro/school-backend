var mongoose = require('mongoose');

var schema = mongoose.Schema({
    allocated_user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    description: String,
    issue_image: {
        type: String,
        default: ''
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "CommentModel"}],
    media: [Object],
    school_id: {type: String, default: ""},
    status: Number,
    created_at: Date,
    updated_at: Date,
    created_by: {},
    updated_by: {}
});

module.exports = mongoose.model('IssueModel', schema);
