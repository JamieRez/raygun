const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const User = require('../models/user');

module.exports = (app) => {

  //New Dimensions
  app.post('/api/dimension/new', (req, res) => {
    if(req.user){
      let newDim = new Dimension();
      newDim.name = req.body.name || "Untitled Dimension";
      newDim.creator = req.user.id;
      newDim.editors = [req.user.id];
      newDim.save().then((newDim) => {
        User.findById(req.user.id).then((user) => {
          user.dimensions.push(newDim._id);
          user.save().then(() => {
            res.send(newDim);
          })
        })
      })
    }
  });

  //Dimension Update or Save
  app.post('/api/dimension/:dimId', (req, res) => {
    if(req.user){
      Dimension.findById(req.params.dimId).then((dim) => {
        if(dim && dim.editors.includes(req.user.id)){
          dim.name = req.body.name || dim.name;
          dim.creator = req.body.creator || dim.creator;
          dim.ideas = req.body.ideas || dim.ideas;
          dim.things = req.body.things || dim.things;
          dim.isPrivate = req.body.isPrivate || dim.isPrivate;
          dim.editors = req.body.editors || dim.editors;
          dim.defaultThings = req.body.defaultThings || dim.defaultThings;
          dim.save().then((dim) => {
            res.send(dim);
          })
        }
      })
    }
  })


}
