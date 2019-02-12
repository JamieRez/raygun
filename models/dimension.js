const mongoose = require('mongoose');
const { Schema } = mongoose;

const DimensionSchema = new Schema({
  name : String,
  creator : {type : String, default : 'James'},
  ideas : {type : [String], default : []},
  things : {type : [String], default : []},
  isPrivate : {type : Boolean, default : false},
  editors : {type : [String], default : []},
  defaultThings : {type : [String], default : []}
});

const Dimension = mongoose.model('Dimension', DimensionSchema);

module.exports = Dimension;
