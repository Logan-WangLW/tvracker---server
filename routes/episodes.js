'use strict';
const express = require('express');
const mongoose = require('mongoose');
const Shows = require('../models/shows');

const router = express.Router();
const passport = require('passport');
const request = require('request-promise');
mongoose.set('useFindAndModify', false);
const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});
router.use(jwtAuth);

//append episodes to shows
router.put('/', jwtAuth, (req, res, next) => {
  const { id } = req.body;
  const { showId } = req.body;

  request({
    method: 'GET',
    url: `https://api.tvmaze.com/shows/${showId}/episodes`,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }).then(body => {
    let episodes = body.map(episode => {
      return {
        episodeId: episode.id,
        season: episode.season,
        number: episode.number,
        airstamp: episode.airstamp,
        airdate: episode.airdate
      };
    });
    let query = { _id: id };
    Shows.findOneAndUpdate(
      query,
      { episodes: episodes },
      { new: true, upsert: true }
    )
      .then(result => {
        res
          .location(`${req.baseUrl}/${result.id}`)
          .status(201)
          .json(result);
      })
      .catch(err => next(err));
  });
});

module.exports = router;
