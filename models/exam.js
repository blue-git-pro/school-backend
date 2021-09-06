var mongoose = require('mongoose');

var schema = mongoose.Schema({
    school_id: {type: String, default: ''},
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "ClassModel"},
    title: String,
    grade_id: {type: mongoose.Schema.Types.ObjectId, ref: "SchoolGradesModel"},
    session_id: {type: mongoose.Schema.Types.ObjectId, ref: "SessionModel"},
    type: String,
    grade_type: String,
    total_score: Number,
    start_time: {},
    end_time: {},
    publish_date: Date,
    result_date: Date,
    notes: String,
    is_published: {type: Boolean, default: false},
    clone_status: {type: Boolean, default: false},
    teacher_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    created_at: Date,
    updated_at: Date,
    created_by: {},
    updated_by: {}
});

module.exports = mongoose.model('ExamModel', schema);
