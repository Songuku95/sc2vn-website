'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Match = require('./matches')

var RegistrationSchema = new Schema({
  registrable: { type: Boolean },
  startDate: { type: Date },
  endDate: { type: Date },
  pending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  infor_required: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{
  _id: false
})


var InvitationSchema = new Schema({
  pending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

var StageSchema = new Schema({
  name: String
})

var TournamentSchema = new Schema({
  name: { type: String, require: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  staffs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  banner: { type: String },
  introduction: { type: String },
  rule: { type: String },
  faq: { type: String },
  registration: { type: RegistrationSchema, required: true, default: {}  },
  invitation: { type: InvitationSchema, required: true, default: {} },
  stages: [StageSchema]
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

TournamentSchema.methods = {
  addParticipant: function(user) {
    this.registration.participants.push(user);
    this.save();
  },

  addPending: function(user) {
    console.log(this.registration.registrable);
    this.registration.pending.push(user);
    this.save();
  },

  removePending: function(user) {
    this.registration.pending.remove(user._id);
    this.save();
  },

  getShowPath: function() {
    return '/tournaments/' + this._id;
  },

  getEditPath: function() {
    return '/tournaments/' + this._id + '/edit';
  },

  getRegisterPath: function() {
    return '/tournaments/' + this._id + '/register'
  },

  toJson: function(callback) {
    Match.find({ tournament: this._id }).exec(function(err, matches) {
      if (err) callback(err)

      var json = { players: [ ' ', ' ', ' ' ], matches: [] }
      for (var match of matches) {
        json.matches.push(match.toJson())
      }

      callback(null, json)
    })
  }
}

TournamentSchema.statics = {
  all: function(callback) {
    return this.find({}).exec(callback);
  },

  fields: function() {
    return 'name owner staffs banner introduction rule faq price registration invitation stages'
  },

  getNewPath: function() {
    return '/tournaments/new';
  }
}

var Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
