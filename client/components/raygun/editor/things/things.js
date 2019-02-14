function createNewThing(thing){
  //Add to dimension
  let newThingData = {};
  Object.assign(newThingData, thing);
  newThingData.dimension = dimBeingEdited;
  newThingData.idea = dimBeingEdited.ideas[thing.idea.id];
  let newThing = new Thing(newThingData);
  newThing.render();
  //Add to things list in editor
  let newThingOption = document.createElement('div');
  newThingOption.classList.add('thingOptionBtn');
  newThingOption.id = 'thingOptionBtn-' + newThing.id;
  $('.editorThingsList').append(newThingOption);
  let newThingOptionLabel = document.createElement('div');
  newThingOptionLabel.classList.add('thingOptionBtnLabel');
  newThingOptionLabel.textContent = newThing.name;
  $(newThingOption).append(newThingOptionLabel);
}

function loadDimensionThings(){
  raygun.get('dimension').get(dimBeingEdited.id).once((things) => {
    for(id in things){
      createNewThing(things[id]);
    }
  })
}

$(document).ready(() => {

})
