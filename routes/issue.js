var express = require('express');
var router = express.Router();
var issueController = require('../controllers/issueController');
var issue = new issueController();

router.get('/get-issues', issue.getIssues);
router.get('/get-issue/:id', issue.getIssue);
router.post('/add-ssue', issue.addIssue);
router.delete('/delete-issue/:id', issue.deleteIssue);
router.put('/edit-ssue', issue.editIssue);
router.post('/add-omment', issue.addComment);
router.put('/change-status', issue.changeStatus);

module.exports = router;