const User = require('../models/User');
const Session = require('../models/Session');
const Match = require('../models/Match');
const Course = require('../models/Course');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin root operator' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User identity purged from network' });
  } else {
    res.status(404).json({ message: 'Identity not found' });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  const userCount = await User.countDocuments({});
  const sessionCount = await Session.countDocuments({});
  const completedSessions = await Session.countDocuments({ status: 'completed' });
  const matchCount = await Match.countDocuments({ status: 'accepted' });
  const courses = await Course.find({});
  const totalSales = courses.reduce((acc, course) => acc + (course.price * course.enrollmentCount), 0);
  const totalEnrollments = courses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);
  const pendingCourses = await Course.countDocuments({ isApproved: false });

  res.json({
    totalUsers: userCount,
    totalSessions: sessionCount,
    completedSessions,
    totalMatches: matchCount,
    totalSales,
    totalEnrollments,
    totalCourses: courses.length,
    pendingCourses,
    growthData: [
      { name: 'Mon', sales: 4000, users: 2400 },
      { name: 'Tue', sales: 3000, users: 1398 },
      { name: 'Wed', sales: 2000, users: 9800 },
      { name: 'Thu', sales: 2780, users: 3908 },
      { name: 'Fri', sales: 1890, users: 4800 },
      { name: 'Sat', sales: 2390, users: 3800 },
      { name: 'Sun', sales: 3490, users: 4300 },
    ]
  });
};

const getPendingCourses = async (req, res) => {
  const courses = await Course.find({ isApproved: false }).populate('instructor', 'name email');
  res.json(courses);
};

const approveCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

const Banner = require('../models/Banner');

const getBanner = async (req, res) => {
  let banner = await Banner.findOne({ isActive: true });
  if (!banner) {
    banner = await Banner.create({});
  }
  res.json(banner);
};

const updateBanner = async (req, res) => {
  const { heroTitle, heroSubtitle } = req.body;
  const banner = await Banner.findOneAndUpdate(
    { isActive: true },
    { heroTitle, heroSubtitle },
    { new: true, upsert: true }
  );
  res.json(banner);
};

const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  const skills = await Skill.find({});
  res.json(skills);
};

const addSkill = async (req, res) => {
  const { name, category } = req.body;
  const skill = await Skill.create({ name, category });
  res.status(201).json(skill);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAnalytics,
  getPendingCourses,
  approveCourse,
  getBanner,
  updateBanner,
  getSkills,
  addSkill,
};
