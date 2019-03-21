//Thing Editor Container
$(this.element).css({
  width : "100%",
  height : "66%",
  display : "flex",
  flexDirection : "column",
  padding : "5px",
  backgroundColor : "#f0f0f0",
  transition : "transform 0.3s ease-in-out"
})
$(this.element).addClass('raygunThingEditor');
$('#raygunLowerEditor').append($(this.element))

//Thing Editor Tab
let thingEditorTab = document.createElement('div');
let thingEditorTabLabel = document.createElement('div');
thingEditorTabLabel.textContent = this.data.label || "Things";
$(thingEditorTab).css({
  height : "25px",
  width : "75px",
  textAlign : "center",
  fontSize : "15px",
  padding : "5px",
  borderBottom : "2px solid #3ea26e",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center"
})
$(thingEditorTab).append(thingEditorTabLabel);
$(this.element).append(thingEditorTab)

let thingsList = document.createElement('div');
$(thingsList).addClass('raygunThingsList');
$(thingsList).css({
  position : "relative",
  marginLeft : "20px",
  display : "flex",
  flexDirection : "row",
  justifyContent : "flex-start",
  alignItems : "flex-start",
  flexWrap : "wrap",
  overflowY : "scroll",
  padding : "10px",
  width : "90%",
  height : "50%",
})
$(this.element).append(thingsList)

//Create New Thing Function
$('.raygunThingsList')[0].createNewThing = function(thing){
  //Add to dimension
  $('.raygunDimPreviewBox')[0].renderThing(thing);
  //Add to things list in editor
  let newThingOption = document.createElement('div');
  newThingOption.classList.add('raygunThingOptionBtn');
  newThingOption.id = 'raygunThingOptionBtn-' + thing.id;
  newThingOption.thingId = thing.id;
  $(newThingOption).css({
    fontSize : "14px",
    textAlign : "center",
    border : "2px solid #3ea26e",
    borderRadius : "8px",
    color :"#2ed17c",
    padding : "5px",
    paddingBottom : "0px",
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
    cursor : "pointer",
    marginRight : "5px",
    marginBottom : "5px"
  })

  if(!thing.parentThing){
    console.log("Append?")
    $('.raygunThingsList').append(newThingOption);
  }else{
    let parentThingBtnId = '#raygunThingOptionBtn-' + thing.parentThing;
    $(parentThingBtnId).append(newThingOption);
  }

  let newThingOptionContent = document.createElement('div');
  newThingOptionContent.classList.add('raygunThingOptionBtnContent');
  newThingOption.append(newThingOptionContent);

  let newThingOptionLabel = document.createElement('div');
  newThingOptionLabel.classList.add('raygunThingOptionBtnLabel');
  newThingOptionLabel.textContent = thing.name;
  $(newThingOptionLabel).css({
    marginBottom : "5px"
  })
  $(newThingOptionContent).append(newThingOptionLabel);

  var sortable = Sortable.create($('.raygunThingsList')[0], {
    direction: 'horizontal',
    onEnd : function(e){

      //Empty the Dimension Space
      $(dimBeingEdited.element).children('.space').empty();
      let thingOptions = $('.raygunThingsList').children();
      for(var i=0; i < thingOptions.length;i++){
        let thingId = thingOptions[i].thingId;
        if(loadedThings[thingId]){
          loadedThings[thingId].loadOrder = i;
          dimBeingEdited.things[i] = thingId;
          loadedThings[thingId].render();
          loadedThings[thingId].save()
          dimBeingEdited.save();
        }
      }
    }
  })

  $(newThingOption).on('click', (e) => {
    e.stopPropagation();
    //TODO
  });

  //Add the thing children too if any
  raygun.get('thing/' + thing.id).get('things').load((thingIds) => {
    if(thingIds){
      for(let i=0; i<thing.thingCount; i++){
        if(thingIds[i]){
          if(!loadedThings[thingIds[i]]){
            let thisRaygun = gun.user(creatorPubKey);
            thisRaygun.get('thing/' + thingIds[i]).load((childThing) => {
              if(childThing){
                loadedThings[childThing.id] = new Thing(childThing)
                createNewThing(loadedThings[childThing.id]);
              }
            })
          }else{
            createNewThing(loadedThings[thingIds[i]])
          }
        }
      }
    }
  })

}
