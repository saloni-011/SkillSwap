const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAnalytics,
  getPendingCourses,
  approveCourse,
  getBanner,
  updateBanner,
  getSkills,
  addSkill,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/analytics').get(getAnalytics);
router.route('/courses/pending').get(getPendingCourses);
router.route('/courses/:id/approve').put(approveCourse);
router.route('/banner').get(getBanner).put(updateBanner);
router.route('/skills').get(getSkills).post(addSkill);

module.exports = router;
