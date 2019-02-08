const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  name : String,
  creator : {type : String, default : 'James'},
  isPrivate : {type : Boolean, default : false},
  editors : Array,
  code : String
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
