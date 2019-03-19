let raygunLoadedIdeas = {}
let raygunLoadedThings = {}

//Editor
let thisElement = $(this.element)[0];
thisElement.classList.add('raygunEditor');
$(thisElement).css({
  width : "100%",
  height : "100%",
  backgroundColor : "#f0f0f0",
  display : "flex",
  flexDirection : "column",
  color : "#2ed17c",
  transition : "transform 0.5s linear"
})

//Sections
let upperEditor = document.createElement('div');
upperEditor.id = 'raygunUpperEditor';
$(upperEditor).css({
  width : "100%",
  height : "80%",
  display : "flex",
  flexDirection : "row",
  transition : "transform 0.5s linear",
})
$(thisElement).append(upperEditor)
let lowerEditor = document.createElement('div');
lowerEditor.id = 'raygunLowerEditor';
$(lowerEditor).css({
  borderTop : "2px solid #3ea26e",
  width : "100%",
  height : "40%",
  marginTop : "3px",
  display : "flex",
  flexDirection : "row",
  transition : "transform 0.5s linear",
})
$(thisElement).append(lowerEditor)

//Loading a Dimension in the Editor
thisElement.loadDimInEditor = (dim) => {
  $('#raygunToolbarLocLabel').css('display', 'none');
  $('#raygunToolbarInput').css('display', 'flex');
  $('#raygunToolbarInput').text(dim.name);

  $('.raygunIdeaBtn').remove();

  $('.raygunDimPreviewBox').empty();
  dim.renderAt('.raygunDimPreviewBox');
  $(dim.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c",
    position : "absolute",
  })

  //Load The Dim's Ideas
  for(id in dim.ideas){
    if(dim.ideas[id]){
      gun.user(dim.creatorPubKey).get('idea/' + id).load((thisIdea) => {
        if(!thisIdea.parentIdea){
          loadedIdeas[thisIdea.id] = new Idea(thisIdea);
          $('.raygunIdeasList')[0].addNewIdea(loadedIdeas[thisIdea.id]);
        }
      })
    }
  }

  //Load the Dim Things
  let dimThings = dim.things;
  for(let i=0; i<dim.thingCount; i++){
    if(dimThings[i]){
      let thisRaygun = gun.user(dim.creatorPubKey);
      thisRaygun.get('thing/' + dimThings[i]).load((thisThing) => {
        if(thisThing){
          if(!thisThing.parentThing){
            raygunLoadedThings[thisThing.id] = new Thing(thisThing);
            raygunLoadedThings[thisThing.id].dimElement = dim.element;
            $('.raygunThingsList')[0].createNewThing(raygunLoadedThings[thisThing.id]);
          }
        }
      })
    }
  }


}
