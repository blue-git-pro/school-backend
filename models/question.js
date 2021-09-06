var mongoose = require('mongoose');

var schema = mongoose.Schema({
    exam_id: {type: mongoose.Schema.Types.ObjectId, ref: "ExamModel"},
    pattern: Number,
    question: {type: String, default: ''},
    time_limit: {},
    publish: {type: Boolean, default: false},
    score: Number,
    created_at: Date,
    updated_at: Date,
    created_by: {},
    updated_by: {}
});

module.exports = mongoose.model('QuestionModel', schema);
