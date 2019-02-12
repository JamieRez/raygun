const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');
const User = require('../models/user');

module.exports = (app) => {

  //New Things
  app.post('/api/thing/new', (req, res) => {
    if(req.user){
      let newThing = new Thing();
      newThing.name = req.body.idea.name;
      newThing.creatorId = req.user.id;
      newThing.creatorName = req.user.username;
      newThing.idea.id = req.body.idea._id;
      newThing.idea.name = req.body.idea.name;
      newThing.save().then((newThing) => {
        //Add to User
        User.findById(req.user.id).then((user) => {
          user.things.push(newThing._id);
          user.save().then(() => {
            //Add to dimension if applicable
            if(req.body.dimension){
              Dimension.findById(req.body.dimension._id).then((dim) => {
                if(dim && dim.editors.includes(req.user.id)){
                  dim.things.push(newThing._id);
                  dim.save();
                  newThing.dimension.id = dim._id;
                  newThing.dimension.name = dim.name;
                  newThing.save();
                }
              })
            }
            res.send(newThing);
          })
        })
      })
    }
  });

  //Thing Update or Save
  app.post('/api/thing/:thingId', (req, res) => {
    if(req.user){
      Thing.findById(req.params.thingId).then((thing) => {
        if(thing){
          thing.name = req.body.name || thing.name;
          thing.creatorId = req.body.creatorId || thing.creatorId;
          thing.creatorName = req.body.creatorName || thing.creatorName;
          thing.isPrivate = req.body.isPrivate || thing.isPrivate;
          thing.dimension.id = req.body.dimension.id || thing.dimension.id;
          thing.dimension.name = req.body.dimension.name || thing.dimension.name
          thing.idea.id = req.body.idea.id || thing.idea.id;
          thing.idea.name = req.body.idea.name || thing.idea.name;
          thing.save().then((thing) => {
            res.send(thing);
          })
        }
      })
    }
  });

  //Get all ideas in a dimension
  app.get('/api/dimension/:dimId/things', (req, res) => {
    Dimension.findById(req.params.dimId).then((dim) => {
      if(dim){
        Thing.find({_id : {$in : dim.things}}).then((things) => {
          if(things){
            res.send(things);
          }
        })
      }
    })
  })


}
