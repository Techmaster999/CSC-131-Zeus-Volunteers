const express = require('express');
const router = express.Router();
const { getUserHistory, registerForActivity } = require('../controllers/participationController');
const { protect } = require('../middleware/auth');

router.get('/hisotry', protect, getUserHisotry);
router.get('/register', protect, registerForActivity);

module.exports = router;