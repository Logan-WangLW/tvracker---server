'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EpisodeSchema = mongoose.Schema({
  season: Number,
  number: Number,
  airstamp: String,
  airdate: Date
});
EpisodeSchema.set('timestamps', true);
EpisodeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result.__v;
  }
});
module.exports = mongoose.model('Episodes', EpisodeSchema);
