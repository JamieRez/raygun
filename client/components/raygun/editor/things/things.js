window.loadedThings = {};

function openThingEditor(thing){
  $('.editorThingsList').css('display', 'none');
  $('.editorThingsEditor').css('display', 'flex');
  $('.thingEditorNameValue').text(thing.name);
  let seenData = {};
  let loadedThingCount = 0;
  for(id in thing.dataFromGun){
    let dataValue = thing.dataFromGun[id];
    if(dataValue && dataValue.exists && !seenData[dataValue.key]){
      seenData[dataValue.key] = true;
      //Now we add the data value to the dom
      let thingDataValue = document.createElement('div');
      thingDataValue.classList.add('thingDataValue');
      thingDataValue.id = dataValue.id;

      let thingDataValueKey = document.createElement('div');
      thingDataValueKey.classList.add('thingDataValueKey');
      thingDataValueKey.textContent = dataValue.key;

      let thingDataValueValue = document.createElement('div');
      thingDataValueValue.classList.add('thingDataValueValue');
      thingDataValueValue.textContent = dataValue.value;
      thingDataValueValue.contentEditable = true;

      $(thingDataValue).append(thingDataValueKey);
      $(thingDataValue).append(thingDataValueValue);
      $('.thingDataValuesList').append(thingDataValue);

      //Update Thing Data Values
      $(thingDataValueValue).on('blur', () => {
        let newValue = $(thingDataValueValue).text();
        if(newValue.length > 0){
          raygun.get(`thingData/${dataValue.id}`).get('value').put(newValue, () => {
            thing.data[dataValue.key] = newValue;
            $(thing.element).remove();
            thing.render(true);
          });
        }
      })
    }
  }
}

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
      openThingEditor(thing);
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

$(document).ready(() => {

  //Go Back to Things List on Thing Editor Back Btn Click
  $('.thingEditorBackBtn').on('click', () => {
    $('.editorThingsEditor').css('display', 'none');
    $('.editorThingsList').css('display', 'flex');
    $('.thingDataValuesList').empty();
  })

})
