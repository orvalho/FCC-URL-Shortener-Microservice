'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: Number
});

module.exports = mongoose.model('urlModel', urlSchema);