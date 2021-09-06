var mongoose = require('mongoose');

var schema = mongoose.Schema({
    student_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    exam_id: {type: mongoose.Schema.Types.ObjectId, ref: "ExamModel"},
    school_id: {type: String, default: ''},
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "ClassModel"},
    score: Number,
    created_at: Date,
    updated_at: Date,
    created_by: {},
    updated_by: {}
});

module.exports = mongoose.model('ResultModel', schema);
