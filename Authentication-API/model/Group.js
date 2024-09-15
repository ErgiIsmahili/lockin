const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  image: {
    type: String,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  },
  howManyDaysPerWeek: {
    type: Number,
    min: 0,
  },
  weeksPerMonth: {
    type: Number,
    min: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
