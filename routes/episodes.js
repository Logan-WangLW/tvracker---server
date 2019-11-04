'use strict';
const express = require('express');

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
  let showId = req.params.id;
  // console.log('showId......', showId);
  request({
    method: 'GET',
    url: `https://api.tvmaze.com/shows/${showId}/episodes`,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }).then(body => {
    console.log('---------BODY---------', body);
    // let newObj = {};
    // if (!body.network) {
    //   newObj = {
    //     id: showId,
    //     name: body.name,
    //     type: body.type,
    //     image: body.image,
    //     status: body.status,
    //     summary: body.summary,
    //     region: 'N/A',
    //     schedule: body.schedule.days,
    //     url: body.url,
    //     userId: req.user._id
    //   };
    // } else {
    //   newObj = {
    //     id: showId,
    //     name: body.name,
    //     type: body.type,
    //     image: body.image,
    //     status: body.status,
    //     summary: body.summary,
    //     region: body.network.country.code,
    //     schedule: body.schedule.days,
    //     url: body.url,
    //     userId: req.user._id
    //   };
    // }
    // console.log('newObj-------->', newObj);
    //   Show.create(newObj)
    //     .then(result => {
    //       res
    //         .location(`${req.originalUrl}/${result.id}`)
    //         .status(201)
    //         .json(result);
    //     })
    //     .catch(err => {
    //       next(err);
    //     });
  });
});

module.exports = router;
