const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  date: { 
    type: Date, 
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: { type: String },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  howManyDaysPerWeek: { type: Number, min: 0 },
  weeksPerMonth: { type: Number, min: 0 },
  streak: { type: Number, default: 0 },
  checkIns: [checkInSchema],
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
