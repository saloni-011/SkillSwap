const User = require('../models/User');

// @desc    Update user profile (skills)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;
    
    if (req.body.skillsOffered) {
      user.skillsOffered = req.body.skillsOffered;
    }
    
    if (req.body.skillsWanted) {
      user.skillsWanted = req.body.skillsWanted;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users (Marketplace)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  const { skill, level, type } = req.query;
  let query = { _id: { $ne: req.user._id } };

  if (skill) {
    if (type === 'teach') {
      query['skillsOffered.name'] = { $regex: skill, $options: 'i' };
      if (level) query['skillsOffered.level'] = level;
    } else {
      query['skillsWanted.name'] = { $regex: skill, $options: 'i' };
      if (level) query['skillsWanted.level'] = level;
    }
  }

  const users = await User.find(query).select('-password');
  res.json(users);
};

// @desc    Get suggested matches
// @route   GET /api/users/matches
// @access  Private
const getSuggestions = async (req, res) => {
  const user = await User.findById(req.user._id);
  const offeredNames = user.skillsOffered.map(s => s.name);
  const wantedNames = user.skillsWanted.map(s => s.name);

  // 1. Try to find smart matches (overlapping skills)
  let query = {
    _id: { $ne: req.user._id },
    $or: [
      { 'skillsOffered.name': { $in: wantedNames } },
      { 'skillsWanted.name': { $in: offeredNames } }
    ]
  };

  let suggestions = await User.find(query).limit(10).select('-password');

  // 2. Fallback: If no smart matches, show top rated mentors
  if (suggestions.length === 0) {
    suggestions = await User.find({ 
      _id: { $ne: req.user._id },
      role: { $in: ['mentor', 'admin'] } 
    })
    .sort({ rating: -1 })
    .limit(10)
    .select('-password');
  }

  // 3. Fallback 2: If still nothing, just show any active users
  if (suggestions.length === 0) {
    suggestions = await User.find({ _id: { $ne: req.user._id } })
    .limit(10)
    .select('-password');
  }

  res.json(suggestions);
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const switchRole = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.role = user.role === 'mentor' ? 'user' : 'mentor';
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserRole = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  updateUserProfile,
  getUsers,
  getSuggestions,
  getUserById,
  switchRole,
  updateUserRole,
};
