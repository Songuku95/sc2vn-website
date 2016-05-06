'use strict';

var assign = require('object-assign');
var only = require('only');
var Match = require('../models/matches');
var User = require('../models/users');
var async = require('async');
var settings = require('../../config/settings')

exports.init = function(req, res, next) {
  res.locals.breadcrumbs.push({
    name: 'Matches',
    address: '/matches'
  })

  next()
}

exports.load = function(req, res, next, id) {
  Match.findById(id, function(err, match) {
    if (err) return next(err);

    req.match = match;
    if (!req.match) return res.render('404');

    res.locals.breadcrumbs.push({
      name: 'Match ' + match._id,
      address: match.getShowPath()
    })

    next();
  })
  .populate('player_1')
  .populate('player_2')
  .populate('tournament', 'name banner')
}

exports.index = function(req, res, next) {
  async.parallel({
    upcomming: function(callback) {
      return Match.upcomming(callback)
    },
    live: function(callback) {
      return Match.live(callback)
    },
    past: function(callback) {
      return Match.past({
        perPage: settings.matches_per_page,
        page: req.params.page
      }, callback)
    }
  }, function(err, results) {
    console.log(results)

    res.render('matches/index', {
      title: 'Matches',
      live: results.live,
      upcomming: results.upcomming,
      past: results.past
    })
  })
}

exports.new = function(req, res) {
  User.all(function(err, users) {
    if (err) return next(err)

    res.render('matches/new', {
      match: new Match(),
      users: users
    });
  })
}

exports.create = function(req, res, next) {
  var match = new Match(only(req.body, Match.fields()));
  match.addGames(req.body.gamesCount)

  match.save(function(err) {
    if (err) return next(err);

    res.redirect(match.getShowPath());
  });
}

exports.show = function(req, res) {
  res.render('matches/show', {
    title: 'View matches',
    match: req.match
  });
}

exports.edit = function(req, res) {
  res.render('matches/edit', {
    match: req.match
  });
}

exports.update = function(req, res) {
  var match = req.match;

  assign(match, only(req.body, Match.fields()));
  match.save();

  res.redirect(match.getShowPath());
}

exports.destroy = function(req, res) {
  req.match.remove();

  res.redirect('/matches');
}
