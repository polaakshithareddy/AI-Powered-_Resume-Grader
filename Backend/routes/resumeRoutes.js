const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All resume routes require authentication
router.use(auth);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/history', resumeController.getHistory);
router.get('/:id', resumeController.getResumeById);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
