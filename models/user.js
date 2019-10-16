'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { ShowSchema } = require('./shows');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  shows: [ShowSchema],
});

UserSchema.methods.serialize = function () {
  return {
    username: this.username || '',
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', UserSchema);