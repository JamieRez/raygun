const User = require('../models/user');
const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const jwt = require('jsonwebtoken');

module.exports = (app) => {

  app.post('/register', (req, res) => {
    User.findOne({username : req.body.username.toLowerCase()}).then((user) => {
      if(user){
        res.send({err : "User Already Exists"});
      }else{
        let newUser = new User;
        newUser.username = req.body.username.toLowerCase();
        newUser.password = newUser.generateHash(req.body.password);
        newUser.save((err, user) => {
          // generate a JWT for this user from the user's id and the secret key
          let userData = {
            id: user._id,
            username : user.username,
          }
          let token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "60 days"});
          res.cookie('userToken', token);
          res.redirect('/')
        });
      }
    })
  });

  app.post('/login', (req, res) => {
    User.findOne({username : req.body.username.toLowerCase()}).then((user) => {
      if(!user){
        res.send({err : "Username does not exist" });
      }
      else if(!user.validPassword(req.body.password)){
        res.send({err : "Incorrect Password" });
      }else{
        // generate a JWT for this user from the user's id and the secret key
        let userData = {
          id: user._id,
          username : user.username
        }
        let token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "60 days"});
        res.cookie('userToken', token);
        res.redirect('/')
      }
    })
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.send();
  })

  app.get('/api/user/:userId/dimensions', (req, res) => {
    Dimension.find({creator : req.params.userId}).then((dims) => {
      if(dims){
        res.send(dims);
      }
    })
  })

}
