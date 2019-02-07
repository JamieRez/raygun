const mongoose = require('mongoose');
const { Schema } = mongoose;

const DimensionSchema = new Schema({
  name : String,
  creator : {type : String, default : 'James'},
  backgroundImage : String,
  backgroundColor : {type : String, default : '#5fa87e'},
  ideas : Array,
  things : Array,
  thingCount : {default : 0, type : Number},
  isPrivate : {type : Boolean, default : false},
  editors : Array,
  defaultIdeas : Array,
  defaultThings : Array
});

const Dimension = mongoose.model('Dimension', DimensionSchema);

module.exports = Dimension;
