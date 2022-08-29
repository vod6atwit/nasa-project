const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: ['true', 'A planet need a keplerName'],
  },
});

module.exports = mongoose.model('Planet', planetsSchema);
