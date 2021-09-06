var mongoose = require('mongoose');

var schema = mongoose.Schema({
    school_id: {type: String, default: ''},
    grade_id: {type: mongoose.Schema.Types.ObjectId, ref: "SchoolGradesModel"},
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: "ClassModel"},
    new_teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reason: String,
    notificationSMS: Boolean,
    notificationEmail: Boolean,
    date_range: [Date],
    single_nonconsecutive_dates: [Date],
    created_by: {},
    updated_by: {},
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('TeacherSubstituteModel', schema);
