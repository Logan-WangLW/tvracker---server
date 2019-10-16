'use strict';

const mongoose = require('mongoose');

const ShowSchema = mongoose.Schema({
  name: String,
  type: String,
  status: String,
  summary: String,
  seenEpisodes: [String],
});

ShowSchema.set('timestamps', true);
ShowSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Shows', ShowSchema);