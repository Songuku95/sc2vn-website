'use strict'

var assign = require('object-assign')
var only = require('only')
var User = require('../models/users')
var Match = require('../models/matches')
var settings = require('../../config/settings')

exports.recentMatches = function(req, res, next) {
  Match.past({ perPage: settings.recent_matches_count, page: 0 }, function(err, matches) {
    if (err) return next(err)

    res.locals.recent_matches = matches
    next()
  })
}

exports.topPlayers = function(req, res, next) {
  User.top({ perPage: settings.top_players_count, page: 0 }, function(err, players) {
    if (err) return next(err)

    res.locals.top_players = players
    next()
  })
}
