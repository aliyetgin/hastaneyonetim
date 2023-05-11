const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  dob: {
    type: Date,
    required: true,
    get: function (value) {
      return value.toLocaleDateString('en-US', {
        day: 'numeric',
        weekday: 'short',
        month: 'long',
        year: 'numeric'
      });
    }
  },
  city: { type: String, required: true },
  roomNo: { type: Number, required: true },
});
module.exports = mongoose.model('Patient', patientSchema);