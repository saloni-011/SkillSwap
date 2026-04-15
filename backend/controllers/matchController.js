const Match = require('../models/Match');

// @desc    Send connection request
// @route   POST /api/matches
// @access  Private
const sendRequest = async (req, res) => {
  const { receiverId } = req.body;

  const existingMatch = await Match.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id }
    ]
  });

  if (existingMatch) {
    return res.status(400).json({ message: 'Request already exists' });
  }

  const match = await Match.create({
    sender: req.user._id,
    receiver: receiverId,
  });

  res.status(201).json(match);
};

// @desc    Update match status (accept/reject)
// @route   PUT /api/matches/:id
// @access  Private
const updateMatchStatus = async (req, res) => {
  const match = await Match.findById(req.params.id);

  if (match) {
    if (match.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    match.status = req.body.status || match.status;
    const updatedMatch = await match.save();
    res.json(updatedMatch);
  } else {
    res.status(404).json({ message: 'Match not found' });
  }
};

// @desc    Get all user matches/requests
// @route   GET /api/matches
// @access  Private
const getMyMatches = async (req, res) => {
  const matches = await Match.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  }).populate('sender receiver', 'name email avatar skillsOffered skillsWanted');

  res.json(matches);
};

module.exports = {
  sendRequest,
  updateMatchStatus,
  getMyMatches,
};
