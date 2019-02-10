const mongoose = require('mongoose');
const { Schema } = mongoose;

const RaygunSchema = new Schema({
  owner : {
    id : String,
    name : String,
    password : String
  },
  code : String
});

const Raygun = mongoose.model('Raygun', RaygunSchema);

module.exports = Raygun;
