const mongoose = require('mongoose');

// Define a room schema and model using Mongoose
const roomSchema = new mongoose.Schema({
    roomNumber: Number,
    capacity: Number,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
  });
  
  const Room = mongoose.model('Room', roomSchema);

  module.exports = Room;
  