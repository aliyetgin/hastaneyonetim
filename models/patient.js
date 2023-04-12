const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  number: String,
  dob: String,
  city: String,
  roomNo: Number
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
