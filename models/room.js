const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  totalBeds: {
    type: Number,
    required: true,
    default: 2
  }
});

  const Room = mongoose.model('Room', roomSchema);

  module.exports = Room;
  