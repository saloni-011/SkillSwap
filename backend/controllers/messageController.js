const Message = require('../models/Message');

// @desc    Get chat history
// @route   GET /api/messages/:receiverId
// @access  Private
const getMessages = async (req, res) => {
  const room = [req.user._id, req.params.receiverId].sort().join('_');
  const messages = await Message.find({ chatRoom: room }).sort('createdAt');
  res.json(messages);
};

module.exports = { getMessages };
