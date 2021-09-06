var express = require('express');
var router = express.Router();
var examController = require('../controllers/examController');
var exam = new examController();

router.get('/getbasedata', exam.getBaseData);
router.get('/get-exams', exam.getExams);
router.get('/get-exam/:id', exam.getExam);
router.post('/add-exam', exam.createExam);
router.post('/edit-exam', exam.updateExam);
router.delete('/delete-exam/:id', exam.deleteExam);
router.get('/get-questions/:exam_id', exam.getQuestions);
router.get('/get-question/:id', exam.getQuestion);
router.post('/add-question', exam.createQuestion);
router.post('/edit-question', exam.updateQuestion);
router.delete('/delete-question/:id', exam.deleteQuestion);

router.get('/get-results', exam.getResults);
router.get('/get-results/:exam_id', exam.getResultsByExamId);
router.get('/get-result/:id', exam.getResult);
router.post('/add-result', exam.createResult);
router.post('/edit-result', exam.updateResult);
router.delete('/delete-result/:id', exam.deleteResult);

module.exports = router;