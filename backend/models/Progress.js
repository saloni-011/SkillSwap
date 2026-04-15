const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedVideos: [
      {
        type: String, // Video ID or URL
      },
    ],
    lastWatchedVideo: {
      type: String,
    },
    lastWatchedTime: {
      type: Number, // Seconds
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Progress', progressSchema);
