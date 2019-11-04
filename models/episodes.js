'use strict';
const mongoose = require('mongoose');

const EpisodeSchema = mongoose.Schema({
  season: Number,
  number: Number,
  airstamp: String,
  airdate: Date,
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shows', required: true }
});
EpisodeSchema.set('timestamps', true);
EpisodeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
  }
});
module.exports = mongoose.model('Episodes', EpisodeSchema);
