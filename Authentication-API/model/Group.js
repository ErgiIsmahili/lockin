const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
export default Group = mongoose.model('Group', groupSchema);  