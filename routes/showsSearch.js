'use strict';

const express = require('express');
const passport = require('passport');
const request = require('request');
const ShowsSearch = require('../models/showsSearch');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});
router.use(jwtAuth);

router.put('/', jwtAuth, (req, res, next) => {
  const { search } = req.body;

  request(
    {
      method: 'GET',
      url: `https://api.tvmaze.com/search/shows?q=${search}`,
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    },
    function(error, response, body) {
      let shows = body.map(({ show }) => {
        return {
          id: show.id,
          name: show.name,
          image: show.image,
          status: show.status,
          type: show.type,
          summary: show.summary
        };
      });
      // console.log('shows after mapping =', shows);

      ShowsSearch.findOneAndUpdate({ userId: req.user._id }, shows, {
        new: true,
        upsert: true
      })
        .then(result => {
          res
            .location(`${req.baseUrl}/${result.id}`)
            .status(201)
            .json(result);
        })
        .catch(err => next(err));
    }
  );
});
module.exports = router;
