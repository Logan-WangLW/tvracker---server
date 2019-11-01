'use strict';
const express = require('express');

const Show = require('../models/shows');

const router = express.Router();
const passport = require('passport');
const request = require('request');

// Protect endpoints using JWT Strategy
router.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

//get all favorites
router.get('/', (req, res, next) => {
  Show.find({ userId: req.user.id })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//post/create favorite
router.post('/:id', (req, res, next) => {
  //const newObj = { show: req.params.id, userId: req.user.id };
  let showId = req.params.id;
  console.log('showId......', showId);
  request(
    {
      method: 'GET',
      url: `https://api.tvmaze.com/shows/${showId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    },
    function(error, response, body) {
      let newObj = {
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
      console.log(newObj);
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
    }
  );
});

//delete endpoint
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Show.findByIdAndDelete(id)
    .then(() => {
      //console.log('Deleted show:', id);
      return Show.find({ userId: req.user.id });
    })
    .then(results => {
      //console.log('Leftover shows:', results);
      res.json(results);
    })
    .catch(err => next(err));
});

module.exports = router;
