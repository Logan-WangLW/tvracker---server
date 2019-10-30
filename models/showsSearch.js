'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: String },
  shows: { type: Array },
});

schema.set('timestamps', true);

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('ShowsSearch', schema);