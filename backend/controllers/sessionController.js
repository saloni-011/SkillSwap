const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Book a session
// @route   POST /api/sessions
// @access  Private
const bookSession = async (req, res) => {
  const { title, mentor, date, duration } = req.body;

  const session = await Session.create({
    title,
    mentor,
    student: req.user._id,
    date,
    duration,
  });

  res.status(201).json(session);
};

// @desc    Get user sessions
// @route   GET /api/sessions
// @access  Private
const getMySessions = async (req, res) => {
  const sessions = await Session.find({
    $or: [{ mentor: req.user._id }, { student: req.user._id }]
  }).populate('mentor student', 'name email avatar');

  res.json(sessions);
};

// @desc    Update session (status/rating)
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (session) {
    session.status = req.body.status || session.status;
    
    if (req.body.rating) {
      session.rating = req.body.rating;
      session.review = req.body.review;
      
      // Update mentor's average rating
      const mentor = await User.findById(session.mentor);
      if (mentor) {
        const totalRating = mentor.rating * mentor.numReviews + req.body.rating;
        mentor.numReviews += 1;
        mentor.rating = totalRating / mentor.numReviews;
        await mentor.save();
      }
    }

    const updatedSession = await session.save();
    res.json(updatedSession);
  } else {
    res.status(404).json({ message: 'Session not found' });
  }
};

module.exports = {
  bookSession,
  getMySessions,
  updateSession,
};
