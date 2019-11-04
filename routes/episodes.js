'use strict';
const express = require('express');

const Episode = require('../models/episodes');
const Show = require('../models/shows');

const router = express.Router();
const passport = require('passport');
const request = require('request-promise');

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});
router.use(jwtAuth);

//append episodes to shows
router.put('/:id', jwtAuth, (req, res, next) => {
  let showID = req.params.id;
  let result;
  Show.find({ id: showID, userId: req.user._id }).then(body => {
    if (body[0]) {
      result = body[0]._id;
    }
  });
  console.log(result);

  // console.log('showId......', showId);
  request({
    method: 'GET',
    url: `https://api.tvmaze.com/shows/${showID}/episodes`,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }).then(body => {
    // console.log('---------BODY---------', body);
    //  season: Number,
    // number: Number,
    // airstamp: String,
    // airdate: Date
    for (let episode of body) {
      // console.log('---EPISODE----', episode);
      let newObj = {};
      newObj = {
        showId: showID,
        season: episode.season,
        number: episode.number,
        airstamp: episode.airstamp,
        airdate: episode.airdate
      };
      // Episode.create(newObj)
      //   .then(result => {
      //     res
      //       .location(`${req.originalUrl}/${result.id}`)
      //       .status(201)
      //       .json(result);
      //   })
      //   .catch(err => {
      //     next(err);
      //   });
    }
  });
});

module.exports = router;
