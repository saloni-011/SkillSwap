const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  getUsers,
  getSuggestions,
  getUserById,
  switchRole,
  updateUserRole,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/suggestions').get(protect, getSuggestions);
router.route('/switch-role').put(protect, switchRole);
router.route('/:id').get(protect, getUserById);
router.route('/:id/role').put(protect, updateUserRole);

module.exports = router;
