const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const User = require('../models/user');

module.exports = (app) => {

  //New Ideas
  app.post('/api/idea/new', (req, res) => {
    if(req.user){
      let newIdea = new Idea();
      newIdea.name = req.body.name || "Untitled Idea";
      newIdea.creatorId = req.user.id;
      newIdea.creatorName = req.user.username;
      newIdea.editors = [req.user.id];
      newIdea.desc = req.body.desc || "This idea is new!";
      newIdea.code = req.body.code || "//Code Your Idea!";
      newIdea.save().then((newIdea) => {
        //Add to User
        User.findById(req.user.id).then((user) => {
          user.ideas.push(newIdea._id);
          user.save().then(() => {
            //Add to dimension if applicable
            if(req.body.dimId){
              Dimension.findById(req.body.dimId).then((dim) => {
                if(dim && dim.editors.includes(req.user.id)){
                  dim.ideas.push(newIdea._id);
                  dim.save();
                }
              })
            }
            res.send(newIdea);
          })
        })
      })
    }
  });

  //Idea Update or Save
  app.post('/api/idea/:ideaId', (req, res) => {
    if(req.user){
      Idea.findById(req.params.ideaId).then((idea) => {
        if(idea && idea.editors.includes(req.user.id)){
          idea.name = req.body.name || idea.name;
          idea.creatorId = req.body.creatorId || idea.creatorId;
          idea.creatorName = req.body.creatorName || idea.creatorName;
          idea.isPrivate = req.body.isPrivate || idea.isPrivate;
          idea.editors = req.body.editors || idea.editors;
          idea.code = req.body.code || idea.code;
          idea.desc = req.body.desc || idea.desc;
          idea.save().then((idea) => {
            res.send(idea);
          })
        }
      })
    }
  });

  //Get all ideas in a dimension
  app.get('/api/dimension/:dimId/ideas', (req, res) => {
    Dimension.findById(req.params.dimId).then((dim) => {
      if(dim){
        Idea.find({_id : {$in : dim.ideas}}).then((ideas) => {
          if(ideas){
            res.send(ideas);
          }
        })
      }
    })
  })


}
