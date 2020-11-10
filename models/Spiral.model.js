const mongoose = require("mongoose");

const spiralSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    goals: {
      type: [ mongoose.Schema.Types.String ]
    }
  },
  {
    timestamps: true,
  }
);

const SpiralModel = mongoose.model('Spirals', spiralSchema);
module.exports = SpiralModel;