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

  $(newThingOption).on('click', () => {
    if(!inDeleteMode){

    }else{
      //Delete this thing
      let thisThingGun = raygun.get('thing/' + thing.id);
      thisThingGun.get('exists').put(false);
      $(`#thingOptionBtn-${thing.id}`).remove();
    }
  })

}

function loadDimensionThings(){
  let dimGun = raygun.get('dimension/' + dimBeingEdited.id);
  dimGun.get('things').map().on((thing) => {
    if(thing && thing.exists && !loadedThings[thing.id]){
      loadedThings[thing.id] = thing;
      let newThing = new Thing(thing);
      createNewThing(newThing);
    }
  })
}
