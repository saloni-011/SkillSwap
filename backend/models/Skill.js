const mongoose = require('mongoose');

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Tech', 'Design', 'Business', 'Art', 'Lifestyle']
    },
    popularity: {
       type: Number,
       default: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
