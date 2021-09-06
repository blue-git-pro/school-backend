var ExamModel = require('../models/exam');
var QuestionModel = require('../models/question');
var ResultModel = require('../models/result');
var ClassModel = require('../models/class');
var SchoolGradesModel = require('../models/schoolGrades');
const db = require("../db").queries;
const {
    saveActivity
} = require('./activityUtil');


class examController {
    async getBaseData(req, res) {
        try {
            let {
                school_id
            } = req.headers

            let unwindUsers = {};
            let lookUp = {};
            let lookUp1 = {};
            let unwindGrades = {};
            let unwindSubjects = {};

            let lookUp2 = {};
            let unwindSessions = {};
            let lookUp3 = {};

            let match = {
                $match: {
                    school_id: school_id
                }
            }

            lookUp = {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "usersData"
                }
            };

            unwindUsers = {
                $unwind: {
                    path: "$usersData",
                    preserveNullAndEmptyArrays: true
                }
            };

            lookUp1 = {
                $lookup: {
                    from: "schoolgradesmodels",
                    localField: "standard_grade_id",
                    foreignField: "_id",
                    as: "gradeData"
                }
            };

            unwindGrades = {
                $unwind: {
                    path: "$gradeData",
                    preserveNullAndEmptyArrays: true
                }
            };

            lookUp2 = {
                $lookup: {
                    from: "subjectmodels",
                    localField: "subject_id",
                    foreignField: "_id",
                    as: "subjectData"
                }
            };

            unwindSubjects = {
                $unwind: {
                    path: "$subjectData",
                    preserveNullAndEmptyArrays: true
                }
            };


            lookUp3 = {
                $lookup: {
                    from: "sessionmodels",
                    localField: "session_id",
                    foreignField: "_id",
                    as: "sessionData"
                }
            };

            unwindSessions = {
                $unwind: {
                    path: "$sessionData",
                    preserveNullAndEmptyArrays: true
                }
            };

            let project = {
                "$project": {
                    "_id": 1,
                    "class_days": 1,
                    "class_type": 1,
                    "created_at": 1,
                    "created_by": 1,
                    "credit": 1,
                    "end_time": 1,
                    "location_id": 1,
                    "location_room_id": 1,
                    "max_student": 1,
                    "itemName": 1,
                    "cloned_on": 1,
                    "cloned": 1,
                    "grade_scale_type": 1,
                    "standard_grade_id": 1,
                    "subject_id": 1,
                    "start_time": 1,
                    "syllabus": 1,
                    "teacher.personal_info": 1,
                    "teacher._id": 1,
                    "teacher.user_id": 1,
                    "teacherName": {
                        $concat: ["$teacher.personal_info.first_name", " ", "$teacher.personal_info.last_name"]
                    },
                    "grade": 1,
                    "subject": 1,
                    "session": 1,
                    "class_days_name": 1,
                    "results_days_names": {
                        $reduce: {
                            input: "$class_days_name",
                            initialValue: "",
                            in: {
                                $concat: ["$$value", "\n", "$$this"]
                            }
                        }
                    }
                }
            }

            let group = {
                $group: {
                    _id: "$_id",
                    class_days: {
                        $first: "$class_days"
                    },
                    class_days_name: {
                        $first: "$class_days.itemName"
                    },
                    class_type: {
                        $first: "$class_type"
                    },
                    credit: {
                        $first: "$credit"
                    },
                    end_time: {
                        $first: "$end_time"
                    },

                    location_id: {
                        $first: "$location_id"
                    },
                    location_room_id: {
                        $first: "$location_room_id"
                    },
                    start_time: {
                        $first: "$start_time"
                    },
                    max_student: {
                        $first: "$max_student"
                    },
                    itemName: {
                        $first: "$name"
                    },
                    standard_grade_id: {
                        $first: "$standard_grade_id"
                    },
                    subject_id: {
                        $first: "$subject_id"
                    },
                    syllabus: {
                        $first: "$syllabus"
                    },

                    created_at: {
                        $first: "$created_at"
                    },
                    created_by: {
                        $first: "$created_by"
                    },
                    cloned_on: {
                        $first: "$cloned_on"
                    },
                    cloned: {
                        $first: "$cloned"
                    },
                    grade_scale_type: {
                        $first: "$grade_scale_type"
                    },
                    teacher: {
                        $first: "$usersData"
                    },
                    grade: {
                        $first: "$gradeData"
                    },
                    subject: {
                        $first: "$subjectData"
                    },
                    session: {
                        $first: "$sessionData"
                    },
                }
            };

            let query = [
                match,
                lookUp,
                unwindUsers,
                lookUp1,
                unwindGrades,
                lookUp2,
                unwindSubjects,
                lookUp3,
                unwindSessions,
                group,
                project
            ];

            let classes = await db.aggregateData(ClassModel, query)
            // Simple classes
            // let classes = await ClassModel.find({
            //     school_id: school_id
            // });
            let school_grades = await SchoolGradesModel.find({
                school_id: school_id
            });

            res.json({
                status: true,
                result: {
                    classes: classes,
                    school_grades: school_grades,
                }
            })
        } catch (e) {
            res.json({
                status: false,
                error: "Getting error: " + e
            })
        }
    }

    async getExams(req, res) {
        try {
            let {
                school_id
            } = req.headers
            let exams = await ExamModel.find({
                school_id: school_id
            }).
            populate("class_id", ["name", "standard_grade_id", "subject_id", "user_id"]).
            populate("session_id", ["name"]).
            populate("grade_id", ["name"]).
            populate("teacher_id", ["personal_info"])

            res.json({
                status: true,
                result: {
                    exams: exams
                }
            })
        } catch (e) {
            res.json({
                status: false,
                error: "Getting error"
            })
        }
    }

    async getExam(req, res) {
        try {
            let {
                id
            } = req.params
            let exam = await ExamModel.findOne({
                _id: id
            }).
            populate("class_id", ["name", "standard_grade_id", "subject_id", "user_id"]).
            populate("session_id", ["name"]).
            populate("grade_id", ["name"]).
            populate("teacher_id", ["personal_info"])

            res.json({
                status: true,
                result: exam
            })
        } catch (e) {
            res.json({
                status: false,
                error: "Getting error"
            })
        }
    }

    async createExam(req, res) {
        let {
            user_id,
            user_name,
            school_id
        } = req.headers;
        let data = req.body
        data['school_id'] = school_id;
        data['created_at'] = Date.now();
        data['created_by'] = {
            name: user_name,
            user_id: user_id
        };

        let item = await ExamModel.create(data);
        saveActivity(user_id, user_name, "Exam", "New Exam has been created.", "Created");
        res.json({
            status: true,
            result: item
        });
    }

    async updateExam(req, res) {
        try {
            let {
                user_id,
                user_name,
                school_id
            } = req.headers;
            let data = req.body
            let id = data['id']
            delete data['id']
    
            data['school_id'] = school_id;
            data['updated_at'] = Date.now();
            data['updated_by'] = {
                name: user_name,
                user_id: user_id
            };
    
            await ExamModel.updateOne({
                _id: id
            }, data);
            saveActivity(user_id, user_name, "Exam", "An Exam has been updated.", "Updated");
            let exams = await ExamModel.find({
                school_id: school_id
            })
            res.json({
                status: true,
                result: exams
            })
        } catch (error) {
            res.json({
                status: false,
                error: error
            })
        }
    }

    async deleteExam(req, res) {
        let {
            id
        } = req.params
        let {
            user_id,
            user_name,
            school_id
        } = req.headers;
        await ExamModel.deleteOne({
            _id: id
        });
        saveActivity(user_id, user_name, "Exam", "An Exam has been deleted.", "Deleted");
        let exams = await ExamModel.find({
            school_id: school_id
        })
        res.json({
            status: true,
            result: exams
        })
    }

    async getQuestions(req, res) {
        try {
            let {
                exam_id
            } = req.params
            let questions = await QuestionModel.find({
                exam_id: exam_id
            })

            res.json({
                status: true,
                result: {
                    questions: questions
                }
            })
        } catch (e) {
            res.json({
                status: false,
                error: error
            })
        }
    }

    async getQuestion(req, res) {
        try {
            let {
                id
            } = req.params
            let question = await QuestionModel.findOne({
                _id: id
            })

            res.json({
                status: true,
                result: question
            })
        } catch (e) {
            res.json({
                status: false,
                error: "Getting error"
            })
        }
    }

    async createQuestion(req, res) {
        let {
            user_id,
            user_name,
        } = req.headers;
        let data = req.body
        data['created_at'] = Date.now();
        data['created_by'] = {
            name: user_name,
            user_id: user_id
        };

        let item = await QuestionModel.create(data);
        saveActivity(user_id, user_name, "Question", "New Question has been created.", "Created");
        res.json({
            status: true,
            result: item
        });
    }

    async updateQuestion(req, res) {
        try {
            let {
                user_id,
                user_name
            } = req.headers;
            let data = req.body
            let id = data['id']
            delete data['id']
            data['updated_at'] = Date.now();
            data['updated_by'] = {
                name: user_name,
                user_id: user_id
            };
    
            await QuestionModel.updateOne({
                _id: id
            }, data);
            saveActivity(user_id, user_name, "Question", "An Question has been updated.", "Updated");

            res.json({
                status: true,
            })
        } catch (error) {
            res.json({
                status: false,
                error: error
            })
        }
    }

    async deleteQuestion(req, res) {
        let {
            id
        } = req.params
        let {
            user_id,
            user_name,
            school_id
        } = req.headers;
        await QuestionModel.deleteOne({
            _id: id
        });
        saveActivity(user_id, user_name, "Question", "An Question has been deleted.", "Deleted");
        res.json({
            status: true,
        })
    }

    async getResults(req, res) {
        try {
            let {
                school_id
            } = req.headers;
            let results = await ResultModel.find({
                school_id: school_id
            }).
            populate("class_id", ["name", "user_id"]).
            populate("exam_id", ["title", "total_score", "publish_date", "result_date"]).
            populate("student_id", ["personal_info"])

            res.json({
                status: true,
                result: results
            })
        } catch (e) {
            res.json({
                status: false,
                error: e
            })
        }
    }

    async getResultsByExamId(req, res) {
        try {
            let {
                exam_id
            } = req.params
            let results = await ResultModel.find({
                exam: exam_id
            }).
            populate("class_id", ["name", "user_id"]).
            populate("exam_id", ["title", "total_score", "publish_date", "result_date"]).
            populate("student_id", ["personal_info"])

            res.json({
                status: true,
                result: results
            })
        } catch (e) {
            res.json({
                status: false,
                error: error
            })
        }
    }

    async getResult(req, res) {
        try {
            let {
                id
            } = req.params
            let result = await ResultModel.findOne({
                _id: id
            }).
            populate("class_id", ["name", "user_id"]).
            populate("exam_id", ["title", "total_score", "publish_date", "result_date"]).
            populate("student_id", ["personal_info"])

            res.json({
                status: true,
                result: result
            })
        } catch (e) {
            res.json({
                status: false,
                error: "Getting error"
            })
        }
    }

    async createResult(req, res) {
        let {
            user_id,
            user_name,
            school_id
        } = req.headers;
        let data = req.body
        data['school_id'] = school_id;
        data['created_at'] = Date.now();
        data['created_by'] = {
            name: user_name,
            user_id: user_id
        };

        let result = await ResultModel.create(data);
        saveActivity(user_id, user_name, "Result", "New Result has been created.", "Created");
        res.json({
            status: true,
            result: result
        });
    }

    async updateResult(req, res) {
        try {
            let {
                user_id,
                user_name
            } = req.headers;
            let data = req.body
            let id = data['id']
            delete data['id']
            data['updated_at'] = Date.now();
            data['updated_by'] = {
                name: user_name,
                user_id: user_id
            };
    
            await ResultModel.updateOne({
                _id: id
            }, data);
            saveActivity(user_id, user_name, "Result", "An Result has been updated.", "Updated");

            res.json({
                status: true,
            })
        } catch (error) {
            res.json({
                status: false,
                error: error
            })
        }
    }

    async deleteResult(req, res) {
        let {
            id
        } = req.params
        let {
            user_id,
            user_name
        } = req.headers;
        await ResultModel.deleteOne({
            _id: id
        });
        saveActivity(user_id, user_name, "Result", "An Result has been deleted.", "Deleted");
        res.json({
            status: true,
        })
    }
}

module.exports = examController;