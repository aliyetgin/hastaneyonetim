const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	dateOfBirth: Date,
	gender: String,
	phoneNumber: String,
	address: String,
	roomNumber: Number,
	queuePosition: Number
  });

  const Patient = mongoose.model('Patient', patientSchema);

  module.exports = Patient;