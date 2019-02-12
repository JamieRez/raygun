const express = require('express');
const app = express();
const Gun = require('gun');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Dimension = require('./models/dimension');
require('dotenv').config();
require('gun/lib/bye')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/raygun', { useNewUrlParser: true });

let server = app.listen(process.env.PORT || '3000');
let gun = Gun({
  // file: 'data.json', // local testing and development
  web: server
});

let userGun = gun.user();

//App Setting
app.set('views', './client/components')
app.set('view engine', 'pug');
app.use(Gun.serve).use(express.static(__dirname));
app.use(express.static('client'))
app.use(express.static('client/components/raygun'))
app.use('/client/components', express.static(__dirname + '/client/components'));
app.use(express.json());
app.use(cookieParser());

//Check that a user is logged in
let checkAuth = function (req, res, next) {
  if (typeof req.cookies.userToken === 'undefined' || req.cookies.userToken === null) {
    req.user = null;
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.userToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
}
app.use(checkAuth);


app.get('/', (req, res) => {
  if(req.user){
    User.findById(req.user.id).then((user) => {
      if(!user){
        res.clearCookie('userToken');
        res.render('main');
      }else{
        console.log(req.hostname);
        if(req.hostname != 'raygun.live' || 'localhost'){
          Dimension.findOne({domainName : req.hostname}).then((dim) => {
            res.render('main', {
              currentUser : req.user,
              dimension : dim
            })
          })
        }else{
          res.render('main', {currentUser : req.user})
        }
      }
    })
  }else{
    res.clearCookie('userToken');
    res.render('main');
  }
})

//Controllers
require('./controllers/user.js')(app, gun);
require('./controllers/dimension.js')(app, gun);
require('./controllers/idea.js')(app, gun);
require('./controllers/thing.js')(app, gun)
