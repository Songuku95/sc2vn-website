'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema({
  title: { type: String, require: true },
  content: { type: String }
},
{
  _id: false
})

var TournamentSchema = new Schema({
  name: { type: String, require: true },
  sections: [SectionSchema]
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

TournamentSchema.methods = {
  addSection: function(section) {

  },

  removeSection: function(index) {

  },

  to_link: function() {
    return '/tournaments/' + this._id;
  },

  to_json: function() {
    return {
      id: this._id,
      name: this.name,
      sections: this.sections.map(section => section._doc)
    };
  }
}

TournamentSchema.statics = {
  all: function(callback) {
    return this.find({}).exec(callback);
  }
}

var Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
