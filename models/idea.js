const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  name : String,
  creatorId : String,
  creatorName : String,
  isPrivate : {type : Boolean, default : false},
  editors : Array,
  code : String,
  desc : String
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
