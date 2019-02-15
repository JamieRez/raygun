window.loadedThings = {};

function createNewThing(thing){
  //Add to dimension
  thing.render();
  //Add to things list in editor
  let newThingOption = document.createElement('div');
  newThingOption.classList.add('thingOptionBtn');
  newThingOption.id = 'thingOptionBtn-' + thing.id;
  $('.editorThingsList').append(newThingOption);
  let newThingOptionLabel = document.createElement('div');
  newThingOptionLabel.classList.add('thingOptionBtnLabel');
  newThingOptionLabel.textContent = thing.name;
  $(newThingOption).append(newThingOptionLabel);
}

function loadDimensionThings(){
  raygun.get(`dimension/${dimBeingEdited.id}`).get('thing').map().once((thing) => {
    if(!loadedThings[thing.id]){
      loadedThings[thing.id] = thing;
      let newThing = new Thing(thing);
      createNewThing(newThing);
    }
  })
}
