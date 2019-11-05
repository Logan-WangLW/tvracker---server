'use strict';

const mongoose = require('mongoose');

const ShowSchema = mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  image: Object,
  status: String,
  summary: String,
  region: String,
  schedule: [String],
  url: String,
  episodes: [
    {
      episodeId: Number,
      season: Number,
      number: Number,
      airstamp: String,
      airdate: Date
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

ShowSchema.set('timestamps', true);
ShowSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
  }
});

module.exports = mongoose.model('Shows', ShowSchema);
