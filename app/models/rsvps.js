'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RSVP = Schema({
  id: String,
  going: [{user: Schema.Types.ObjectId, created_at: Date}]
})

module.exports = mongoose.model('RSVP', RSVP);
