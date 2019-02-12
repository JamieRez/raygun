const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThingSchema = new Schema({
  name : String,
  dimension : {
    name : String,
    id : String
  },
  idea : {
    name : String,
    id : String
  },
  creatorId : String,
  creatorName : String,
  isPrivate : {type : Boolean, default : false}
});

const Thing = mongoose.model('Thing', ThingSchema);

module.exports = Thing;
