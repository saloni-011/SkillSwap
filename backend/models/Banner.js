const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
  {
    heroTitle: {
      type: String,
      required: true,
      default: "Ab Hoga Skill Exchange Sabke Liye Aasaan!"
    },
    heroSubtitle: {
      type: String,
      required: true,
      default: "Join SkillSwap and learn anything from mentors for free by teaching what you know."
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
