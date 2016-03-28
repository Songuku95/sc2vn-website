'use strict';

var assign = require('object-assign');
var only = require('only');
var Tournament = require('../models/tournaments');

exports.load = function(req, res, next, id) {
  Tournament.findById(id, function(err, tournament) {
    if (err) return next(err);

    req.tournament = tournament;
    if (!req.tournament) return res.render('404');
    next();
  });
}

exports.index = function(req, res, next) {
  Tournament.all(function(err, tournaments) {
    if (err) return next(err);

    res.render('tournaments/index', {
      tournaments: tournaments
    });
  });
}

exports.new = function(req, res) {
  res.render('tournaments/new', {
    tournament: new Tournament()
  });
}

exports.create = function(req, res, next) {
  var tournament = new Tournament(only(req.body, Tournament.fields()));
  tournament.save(function(err) {
    if (err) return next(err);
    else {
      res.redirect(tournament.getShowPath());
    }
  });
}

exports.show = function(req, res) {
  res.render('tournaments/show', {
    tournament: req.tournament
  });
}

exports.edit = function(req, res) {
  res.render('tournaments/edit', {
    tournament: req.tournament
  });
}

exports.update = function(req, res) {
  var tournament = req.tournament;

  assign(tournament, only(req.body, Tournament.fields()));
  tournament.save();

  res.redirect(tournament.getShowPath());
}

exports.destroy = function(req, res) {
  req.tournament.remove();

  res.redirect('/tournaments');
}
