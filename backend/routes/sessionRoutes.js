const express = require('express');
const router = express.Router();
const {
  bookSession,
  getMySessions,
  updateSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, bookSession).get(protect, getMySessions);
router.route('/:id').put(protect, updateSession);

module.exports = router;
