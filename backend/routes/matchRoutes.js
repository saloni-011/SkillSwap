const express = require('express');
const router = express.Router();
const {
  sendRequest,
  updateMatchStatus,
  getMyMatches,
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendRequest).get(protect, getMyMatches);
router.route('/:id').put(protect, updateMatchStatus);

module.exports = router;
