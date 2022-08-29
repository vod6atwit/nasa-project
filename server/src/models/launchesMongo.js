const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: ['true', 'A launch need a flightNumber'],
  },
  launchDate: {
    type: Date,
    required: ['true', 'A launch need a launch Date'],
  },
  mission: {
    type: String,
    required: ['true', 'A launch need a mission'],
  },
  rocket: {
    type: String,
    required: ['true', 'A launch need a rocket'],
  },
  target: {
    type: String,
    // required: ['true', 'A launch need a target'],
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: ['true', 'A launch need to know upcoming or not'],
  },
  success: {
    type: Boolean,
    required: ['true', 'A launch need to know success or not'],
    default: true,
  },
});

// connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);
