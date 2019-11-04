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

//get all tracked shows
router.get('/', jwtAuth, (req, res, next) => {
  Show.find({ userId: req.user._id })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//add new show to tracked shows
router.put('/:id', jwtAuth, (req, res, next) => {
  let showId = req.params.id;
  // console.log('showId......', showId);
  request({
    method: 'GET',
    url: `https://api.tvmaze.com/shows/${showId}`,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }).then(body => {
    // console.log('---------reached---------', body);
    let newObj = {};
    if (!body.network) {
      newObj = {
        id: showId,
        name: body.name,
        type: body.type,
        image: body.image,
        status: body.status,
        summary: body.summary,
        region: 'N/A',
        schedule: body.schedule.days,
        url: body.url,
        userId: req.user._id
      };
    } else {
      newObj = {
        id: showId,
        name: body.name,
        type: body.type,
        image: body.image,
        status: body.status,
        summary: body.summary,
        region: body.network.country.code,
        schedule: body.schedule.days,
        url: body.url,
        userId: req.user._id
      };
    }
    // console.log('newObj-------->', newObj);
    Show.create(newObj)
      .then(result => {
        res
          .location(`${req.originalUrl}/${result.id}`)
          .status(201)
          .json(result);
      })
      .catch(err => {
        next(err);
      });
  });
});

//delete endpoint
//need to pass in _id in database and not the show id
router.delete('/:id', jwtAuth, (req, res, next) => {
  const id = req.params.id;
  Show.findByIdAndDelete(id)
    .then(() => {
      //console.log('Deleted show:', id);
      return Show.find({ userId: req.user._id });
    })
    .then(results => {
      //console.log('Leftover shows:', results);
      res.json(results);
    })
    .catch(err => next(err));
});

module.exports = router;
