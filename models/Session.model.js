const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model('Sessions', sessionSchema);
module.exports = SessionModel;