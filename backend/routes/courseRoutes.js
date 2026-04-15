const express = require('express');
const router = express.Router();
const { 
  getAllCourses, 
  getCourseById, 
  createCourse 
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllCourses)
  .post(protect, createCourse);

router.route('/:id')
  .get(getCourseById);

module.exports = router;
