const Course = require('../models/Course');

// @desc    Get all approved courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  const { category, level, search } = req.query;
  let query = { isApproved: true };

  if (category) query.category = category;
  if (level) query.level = level;
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const courses = await Course.find(query).populate('instructor', 'name email');
  res.json(courses);
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
  const { title, description, price, category, level, thumbnail } = req.body;
  
  const course = new Course({
    title,
    description,
    price,
    category,
    level,
    thumbnail,
    instructor: req.user._id,
    isApproved: false // Needs admin approval
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
};
